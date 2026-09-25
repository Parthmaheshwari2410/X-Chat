import express from "express";
import { protectroutes } from "../middleware/auth.js";
import {
    addMembers,
    createGroup,
    deleteGroup,
    getGroup,
    getGroupMessages,
    getGroups,
    leaveGroup,
    removeMember,
    sendGroupMessage,
    updateGroup,
} from "../controllers/groupController.js";

const groupRouter = express.Router();

groupRouter.use(protectroutes);
groupRouter.post("/", createGroup);
groupRouter.get("/", getGroups);
groupRouter.get("/:groupId", getGroup);
groupRouter.put("/:groupId", updateGroup);
groupRouter.delete("/:groupId", deleteGroup);
groupRouter.post("/:groupId/members", addMembers);
groupRouter.delete("/:groupId/members/:userId", removeMember);
groupRouter.post("/:groupId/leave", leaveGroup);
groupRouter.get("/:groupId/messages", getGroupMessages);
groupRouter.post("/:groupId/messages", sendGroupMessage);

export default groupRouter;
