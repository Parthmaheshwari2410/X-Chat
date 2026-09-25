import { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";

import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";

const RightSidebar = () => {
    const { selectedUser, selectedGroup, messages, groupMessages, users, leaveGroup, updateGroup, addGroupMembers, removeGroupMember, deleteGroup } = useContext(ChatContext);
    const { logout, onlineUsers, authUser } = useContext(AuthContext);
    const [msgImages, setMsgImages] = useState([]);
    const [editingGroup, setEditingGroup] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [groupDescription, setGroupDescription] = useState("");
    const [newMembers, setNewMembers] = useState([]);
    const [showAddMembers, setShowAddMembers] = useState(false);

    // Get all the images from the messages and set them to state
    useEffect(() => {
        const activeMessages = selectedGroup ? groupMessages : messages;
        setMsgImages(activeMessages.filter((msg) => msg.image).map((msg) => msg.image));
    }, [messages, groupMessages, selectedGroup]);

    useEffect(() => {
        setShowAddMembers(false);
        setNewMembers([]);
    }, [selectedGroup?._id]);

    const isAdmin = selectedGroup && String(selectedGroup.admin?._id || selectedGroup.admin) === String(authUser?._id);

    const saveGroup = async (event) => {
        event.preventDefault();
        await updateGroup(selectedGroup._id, { name: groupName, description: groupDescription });
        setEditingGroup(false);
    };

    return (
        (selectedUser || selectedGroup) && (
            <div
                className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll ${selectedUser || selectedGroup ? "max-md:hidden" : ""
                    }`}
            >
                <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">
                    <img
                        src={(selectedGroup || selectedUser)?.profilePic || assets.avatar_icon}
                        alt="profile"
                        className="w-20 aspect-[1/1] rounded-full"
                    />
                    <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
                        {selectedUser && onlineUsers.includes(selectedUser._id) && (
                            <p className="w-2 h-2 rounded-full bg-green-500"></p>
                        )}
                        {selectedGroup ? selectedGroup.name : selectedUser.fullName}
                    </h1>
                    <p className="px-10 mx-auto">{selectedGroup ? selectedGroup.description : selectedUser.bio}</p>
                </div>

                <hr className="border-[#ffffff50] my-4" />

                {selectedGroup && (
                    <div className="px-5 text-xs">
                        <p>Members ({selectedGroup.members.length})</p>
                        <div className="mt-2 flex max-h-48 flex-col gap-2 overflow-y-auto">
                            {selectedGroup.members.map((member) => (
                                <div key={member._id} className="flex items-center gap-2">
                                    <img src={member.profilePic || assets.avatar_icon} alt="" className="h-7 w-7 rounded-full" />
                                    <span>{member.fullName}</span>
                                    {String(member._id) === String(selectedGroup.admin?._id || selectedGroup.admin) && <span className="text-violet-300">admin</span>}
                                    {isAdmin && String(member._id) !== String(authUser?._id) && <button type="button" onClick={() => removeGroupMember(selectedGroup._id, member._id)} className="ml-auto text-red-200">remove</button>}
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={() => leaveGroup(selectedGroup._id)} className="mt-4 w-full rounded-full border border-red-300/50 p-2 text-red-200">Leave group</button>
                        {isAdmin && (
                            <div className="mt-4 border-t border-white/20 pt-4">
                                {!editingGroup ? (
                                    <button type="button" onClick={() => { setGroupName(selectedGroup.name); setGroupDescription(selectedGroup.description || ""); setEditingGroup(true); }} className="w-full rounded-full border border-violet-300/50 p-2">Edit group</button>
                                ) : (
                                    <form onSubmit={saveGroup} className="flex flex-col gap-2">
                                        <input value={groupName} onChange={(event) => setGroupName(event.target.value)} required className="rounded bg-black/20 p-2" />
                                        <textarea value={groupDescription} onChange={(event) => setGroupDescription(event.target.value)} className="rounded bg-black/20 p-2" />
                                        <button type="submit" className="rounded bg-violet-600 p-2">Save changes</button>
                                    </form>
                                )}
                                <button type="button" onClick={() => setShowAddMembers((previous) => !previous)} className="mt-3 w-full rounded border border-violet-300/50 p-2">
                                    {showAddMembers ? "Hide people" : "Add people"}
                                </button>
                                {showAddMembers && (
                                    <>
                                        <div className="max-h-24 overflow-y-auto">
                                            {users.filter((user) => !selectedGroup.members.some((member) => String(member._id) === String(user._id))).map((user) => (
                                                <label key={user._id} className="flex items-center gap-2 p-1">
                                                    <input type="checkbox" checked={newMembers.includes(user._id)} onChange={() => setNewMembers((previous) => previous.includes(user._id) ? previous.filter((id) => id !== user._id) : [...previous, user._id])} />
                                                    <span>{user.fullName}</span>
                                                </label>
                                            ))}
                                        </div>
                                        <button type="button" onClick={() => { addGroupMembers(selectedGroup._id, newMembers); setNewMembers([]); setShowAddMembers(false); }} className="mt-2 w-full rounded bg-violet-600 p-2">Add selected</button>
                                    </>
                                )}
                                <button type="button" onClick={() => deleteGroup(selectedGroup._id)} className="mt-2 w-full rounded border border-red-300/50 p-2 text-red-200">Delete group</button>
                            </div>
                        )}
                    </div>
                )}

                <div className="px-5 text-xs">
                    <p>Media</p>
                    <div className="mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80">
                        {msgImages.map((url, index) => (
                            <div
                                key={index}
                                onClick={() => window.open(url)}
                                className="cursor-pointer rounded"
                            >
                                <img src={url} alt="image" className="h-full rounded-md" />
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light py-2 px-20 rounded-full cursor-pointer"
                >
                    Logout
                </button>
            </div>
        )
    );
};

export default RightSidebar;