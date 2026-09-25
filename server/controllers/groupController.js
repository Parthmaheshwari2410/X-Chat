import mongoose from "mongoose";
import Group from "../models/Group.js";
import GroupMessage from "../models/GroupMessage.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { io } from "../server.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const getMemberGroup = async (groupId, userId) => {
    if (!isValidId(groupId)) return null;
    return Group.findOne({ _id: groupId, members: userId });
};

const serializeMessage = (message) => message.populate({
    path: "senderId",
    select: "fullName profilePic",
});

// Create a group and make the authenticated user its administrator.
export const createGroup = async (req, res) => {
    try {
        const { name, description = "", profilePic = "", memberIds = [] } = req.body;
        if (!name?.trim() || !Array.isArray(memberIds)) {
            return res.status(400).json({ success: false, message: "Group name and members are required" });
        }

        const uniqueMembers = [...new Set(memberIds.map(String))];
        if (uniqueMembers.some((id) => !isValidId(id))) {
            return res.status(400).json({ success: false, message: "Invalid member id" });
        }

        const members = [...new Set([String(req.user._id), ...uniqueMembers])];
        const users = await User.find({ _id: { $in: members } }).select("_id");
        if (users.length !== members.length) {
            return res.status(404).json({ success: false, message: "One or more users were not found" });
        }

        const group = await Group.create({
            name: name.trim(),
            description: description.trim(),
            profilePic,
            admin: req.user._id,
            members,
        });
        const populatedGroup = await group.populate("members", "fullName profilePic");
        io.emit("groupCreated", populatedGroup);
        return res.status(201).json({ success: true, group: populatedGroup });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: "Unable to create group" });
    }
};

// Return only groups that contain the authenticated user.
export const getGroups = async (req, res) => {
    try {
        const groups = await Group.find({ members: req.user._id })
            .populate("members", "fullName profilePic")
            .populate("admin", "fullName profilePic")
            .sort({ updatedAt: -1 });
        return res.json({ success: true, groups });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: "Unable to load groups" });
    }
};

// Return group details only to members.
export const getGroup = async (req, res) => {
    try {
        const group = await Group.findOne({ _id: req.params.groupId, members: req.user._id })
            .populate("members", "fullName profilePic")
            .populate("admin", "fullName profilePic");
        if (!group) return res.status(404).json({ success: false, message: "Group not found" });
        return res.json({ success: true, group });
    } catch (error) {
        return res.status(400).json({ success: false, message: "Invalid group id" });
    }
};

// Update group details; only the administrator may perform this action.
export const updateGroup = async (req, res) => {
    try {
        const group = await Group.findOne({ _id: req.params.groupId, admin: req.user._id });
        if (!group) return res.status(403).json({ success: false, message: "Only the group admin can update it" });
        const { name, description, profilePic } = req.body;
        if (name !== undefined && !name.trim()) return res.status(400).json({ success: false, message: "Group name is required" });
        if (name !== undefined) group.name = name.trim();
        if (description !== undefined) group.description = description.trim();
        if (profilePic !== undefined) group.profilePic = profilePic;
        await group.save();
        const populatedGroup = await group.populate("members", "fullName profilePic");
        io.to(`group:${group._id}`).emit("groupUpdated", populatedGroup);
        return res.json({ success: true, group: populatedGroup });
    } catch (error) {
        return res.status(400).json({ success: false, message: "Unable to update group" });
    }
};

// Delete a group; only the administrator may delete it.
export const deleteGroup = async (req, res) => {
    const group = await Group.findOneAndDelete({ _id: req.params.groupId, admin: req.user._id });
    if (!group) return res.status(403).json({ success: false, message: "Only the group admin can delete it" });
    io.to(`group:${group._id}`).emit("groupDeleted", String(group._id));
    await GroupMessage.deleteMany({ groupId: group._id });
    return res.json({ success: true });
};

// Add members while preventing duplicate membership.
export const addMembers = async (req, res) => {
    try {
        const group = await Group.findOne({ _id: req.params.groupId, admin: req.user._id });
        if (!group) return res.status(403).json({ success: false, message: "Only the group admin can add members" });
        const memberIds = req.body.memberIds;
        if (!Array.isArray(memberIds) || memberIds.some((id) => !isValidId(id))) return res.status(400).json({ success: false, message: "Invalid member list" });
        const newIds = memberIds.filter((id) => !group.members.some((member) => String(member) === String(id)));
        const users = await User.find({ _id: { $in: newIds } }).select("_id");
        if (users.length !== newIds.length) return res.status(404).json({ success: false, message: "User not found" });
        group.members.push(...newIds);
        await group.save();
        const populatedGroup = await group.populate("members", "fullName profilePic");
        io.to(`group:${group._id}`).emit("groupMemberAdded", populatedGroup);
        return res.json({ success: true, group: populatedGroup });
    } catch (error) {
        return res.status(400).json({ success: false, message: "Unable to add members" });
    }
};

// Remove a member; self-removal uses the leave endpoint instead.
export const removeMember = async (req, res) => {
    try {
        const group = await Group.findOne({ _id: req.params.groupId, admin: req.user._id });
        if (!group) return res.status(403).json({ success: false, message: "Only the group admin can remove members" });
        if (String(req.params.userId) === String(req.user._id)) return res.status(400).json({ success: false, message: "Use leave group to remove yourself" });
        if (!group.members.some((member) => String(member) === req.params.userId)) return res.status(404).json({ success: false, message: "Member not found" });
        group.members = group.members.filter((member) => String(member) !== req.params.userId);
        await group.save();
        io.to(`group:${group._id}`).emit("groupMemberRemoved", { groupId: String(group._id), userId: req.params.userId });
        return res.json({ success: true });
    } catch (error) {
        return res.status(400).json({ success: false, message: "Unable to remove member" });
    }
};

// Leave a group; transfer administration or delete the group when necessary.
export const leaveGroup = async (req, res) => {
    const group = await Group.findOne({ _id: req.params.groupId, members: req.user._id });
    if (!group) return res.status(404).json({ success: false, message: "Group not found" });
    group.members = group.members.filter((member) => String(member) !== String(req.user._id));
    if (String(group.admin) === String(req.user._id)) {
        if (!group.members.length) {
            await Group.findByIdAndDelete(group._id);
            await GroupMessage.deleteMany({ groupId: group._id });
            io.to(`group:${group._id}`).emit("groupDeleted", String(group._id));
            return res.json({ success: true, deleted: true });
        }
        group.admin = group.members[0];
    }
    await group.save();
    io.to(`group:${group._id}`).emit("groupMemberRemoved", { groupId: String(group._id), userId: String(req.user._id) });
    return res.json({ success: true });
};

// Load messages only when the authenticated user belongs to the group.
export const getGroupMessages = async (req, res) => {
    const group = await getMemberGroup(req.params.groupId, req.user._id);
    if (!group) return res.status(403).json({ success: false, message: "You are not a group member" });
    const messages = await GroupMessage.find({ groupId: group._id })
        .populate("senderId", "fullName profilePic")
        .sort({ createdAt: 1 });
    await GroupMessage.updateMany({ groupId: group._id }, { $addToSet: { seenBy: req.user._id } });
    return res.json({ success: true, messages });
};

// Save and broadcast a group message only to verified group members.
export const sendGroupMessage = async (req, res) => {
    try {
        const group = await getMemberGroup(req.params.groupId, req.user._id);
        if (!group) return res.status(403).json({ success: false, message: "You are not a group member" });
        const { text, image } = req.body;
        if (!text?.trim() && !image) return res.status(400).json({ success: false, message: "Message cannot be empty" });
        let imageUrl;
        if (image) {
            const upload = await cloudinary.uploader.upload(image);
            imageUrl = upload.secure_url;
        }
        const message = await GroupMessage.create({ groupId: group._id, senderId: req.user._id, text: text?.trim(), image: imageUrl, seenBy: [req.user._id] });
        const populatedMessage = await serializeMessage(message);
        io.to(`group:${group._id}`).emit("newGroupMessage", populatedMessage);
        return res.status(201).json({ success: true, message: populatedMessage });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: "Unable to send group message" });
    }
};
