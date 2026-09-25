import { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Sidebar = () => {
    const {
        getUsers,
        users,
        groups,
        selectedUser,
        setSelectedUser,
        selectedGroup,
        setSelectedGroup,
        createGroup,
        unseenMessages,
        setUnseenMessages,
    } = useContext(ChatContext);

    const { logout, onlineUsers } = useContext(AuthContext);

    const [input, setInput] = useState(false);
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [groupDescription, setGroupDescription] = useState("");
    const [groupProfilePic, setGroupProfilePic] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);

    const navigate = useNavigate();

    const filteredUsers = input
        ? users.filter((user) =>
            user.fullName.toLowerCase().includes(input.toLowerCase())
        )
        : users;

    const handleCreateGroup = async (event) => {
        event.preventDefault();
        const group = await createGroup({
            name: groupName,
            description: groupDescription,
            profilePic: groupProfilePic,
            memberIds: selectedMembers,
        });
        if (group) {
            setShowCreateGroup(false);
            setGroupName("");
            setGroupDescription("");
            setGroupProfilePic("");
            setSelectedMembers([]);
            setSelectedUser(null);
            setSelectedGroup(group);
        }
    };

    useEffect(() => {
        getUsers();
    }, [onlineUsers]);

    return (
        <div
            className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser || selectedGroup ? "max-md:hidden" : ""
                }`}
        >
            <div className="pb-5">
                <div className="flex justify-between items-center">
                    <img src={assets.logo} alt="logo" className="max-w-40" />
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setShowCreateGroup(true)}
                            className="text-xl leading-none text-violet-300"
                            title="Create group"
                        >
                            +
                        </button>
                        <div className="relative py-2 group">
                            <img
                                src={assets.menu_icon}
                                alt="menu"
                                className="max-h-5 cursor-pointer"
                            />
                            <div className="absolute top-full right-0 z-20 hidden w-32 rounded-md border border-gray-600 bg-[#282142] p-5 text-gray-100 group-hover:block">
                                <p
                                    onClick={() => navigate("/profile")}
                                    className="cursor-pointer text-sm"
                                >
                                    Edit Profile
                                </p>
                                <hr className="my-2 border-t border-gray-500" />
                                <button type="button" onClick={logout} className="cursor-pointer text-sm">
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
                    <img src={assets.search_icon} alt="Search" className="w-3" />
                    <input
                        onChange={(e) => setInput(e.target.value)}
                        type="text"
                        className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
                        placeholder="Search User..."
                    />
                </div>
            </div>

            <div className="flex flex-col">
                {filteredUsers.map((user, index) => (
                    <div
                        onClick={() => {
                            setSelectedUser(user);
                            setSelectedGroup(null);
                            setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
                        }}
                        key={index}
                        className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id && "bg-[#282142]/50"
                            }`}
                    >
                        <img
                            src={user?.profilePic || assets.avatar_icon}
                            alt="profile"
                            className="w-[35px] aspect-[1/1] rounded-full"
                        />
                        <div className="flex flex-col leading-5">
                            <p>{user.fullName}</p>
                            {onlineUsers.includes(user._id) ? (
                                <span className="text-green-400 text-xs">Online</span>
                            ) : (
                                <span className="text-neutral-400 text-xs">Offline</span>
                            )}
                        </div>
                        {unseenMessages[user._id] > 0 && (
                            <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50">
                                {unseenMessages[user._id]}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            <p className="mt-6 text-sm font-medium">Groups</p>
            <div className="mt-2 flex flex-col gap-1">
                {groups.map((group) => (
                    <button
                        type="button"
                        key={group._id}
                        onClick={() => {
                            const isSelected = selectedGroup?._id === group._id;
                            setSelectedGroup(isSelected ? null : group);
                            setSelectedUser(null);
                        }}
                        className={`flex items-center gap-2 p-2 rounded text-left ${selectedGroup?._id === group._id ? "bg-[#282142]/70" : "hover:bg-[#282142]/40"}`}
                    >
                        <img src={group.profilePic || assets.avatar_icon} alt="" className="w-8 h-8 rounded-full" />
                        <span className="truncate text-sm">{group.name}</span>
                    </button>
                ))}
            </div>

            {showCreateGroup && (
                <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 p-4">
                    <form onSubmit={handleCreateGroup} className="w-full max-w-md rounded-lg bg-[#282142] p-5 text-white">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-medium">Create group</h2>
                            <button type="button" onClick={() => setShowCreateGroup(false)} className="text-xl">x</button>
                        </div>
                        <input value={groupName} onChange={(event) => setGroupName(event.target.value)} required placeholder="Group name" className="mt-4 w-full rounded border border-gray-500 bg-transparent p-2 outline-none" />
                        <label className="mt-3 block rounded border border-gray-500 p-2 text-sm">
                            <span>Group image (optional)</span>
                            <input type="file" accept="image/png,image/jpeg" onChange={(event) => {
                                const file = event.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = () => setGroupProfilePic(reader.result);
                                reader.readAsDataURL(file);
                            }} className="mt-2 block w-full text-xs" />
                        </label>
                        <textarea value={groupDescription} onChange={(event) => setGroupDescription(event.target.value)} placeholder="Description" className="mt-3 w-full rounded border border-gray-500 bg-transparent p-2 outline-none" />
                        <p className="mt-4 text-sm text-gray-300">Select members</p>
                        <div className="mt-2 max-h-40 overflow-y-auto">
                            {users.map((user) => (
                                <label key={user._id} className="flex items-center gap-2 p-2">
                                    <input type="checkbox" checked={selectedMembers.includes(user._id)} onChange={() => setSelectedMembers((previous) => previous.includes(user._id) ? previous.filter((id) => id !== user._id) : [...previous, user._id])} />
                                    <img src={user.profilePic || assets.avatar_icon} alt="" className="h-7 w-7 rounded-full" />
                                    <span>{user.fullName}</span>
                                </label>
                            ))}
                        </div>
                        <button type="submit" className="mt-4 w-full rounded-full bg-violet-600 p-2">Create group</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Sidebar;