import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [groupMessages, setGroupMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});

    const { socket, axios, authUser, onlineUsers } = useContext(AuthContext);

    // Function to get all users for sidebar
    const getUsers = async () => {
        try {
            const { data } = await axios.get("/api/messages/users");

            if (data.success) {
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getGroups = async () => {
        try {
            const { data } = await axios.get("/api/groups");
            if (data.success) setGroups(data.groups);
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Function to get messages for selected user
    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`);

            if (data.success) {
                setMessages(data.messages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Function to send message to selected user
    const sendMessage = async (messageData) => {
        try {
            const { data } = await axios.post(
                `/api/messages/send/${selectedUser._id}`,
                messageData
            );

            if (data.success) {
                setMessages((prevMessages) => [...prevMessages, data.newMessage]);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getGroupMessages = async (groupId) => {
        try {
            const { data } = await axios.get(`/api/groups/${groupId}/messages`);
            if (data.success) setGroupMessages(data.messages);
        } catch (error) {
            toast.error(error.message);
            setGroupMessages([]);
        }
    };

    const sendGroupMessage = async (messageData) => {
        try {
            const { data } = await axios.post(`/api/groups/${selectedGroup._id}/messages`, messageData);
            if (data.success) setGroupMessages((previous) => [...previous, data.message]);
            else toast.error(data.message);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const createGroup = async (groupData) => {
        try {
            const { data } = await axios.post("/api/groups", groupData);
            if (!data.success) {
                toast.error(data.message);
                return null;
            }
            setGroups((previous) => previous.some((group) => group._id === data.group._id) ? previous : [data.group, ...previous]);
            toast.success("Group created");
            return data.group;
        } catch (error) {
            toast.error(error.message);
            return null;
        }
    };

    const leaveGroup = async (groupId) => {
        try {
            const { data } = await axios.post(`/api/groups/${groupId}/leave`);
            if (data.success) {
                setGroups((previous) => previous.filter((group) => group._id !== groupId));
                setSelectedGroup(null);
                setGroupMessages([]);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const updateGroup = async (groupId, groupData) => {
        try {
            const { data } = await axios.put(`/api/groups/${groupId}`, groupData);
            if (data.success) {
                setGroups((previous) => previous.map((group) => group._id === groupId ? data.group : group));
                setSelectedGroup(data.group);
            } else toast.error(data.message);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const addGroupMembers = async (groupId, memberIds) => {
        try {
            const { data } = await axios.post(`/api/groups/${groupId}/members`, { memberIds });
            if (data.success) {
                setGroups((previous) => previous.map((group) => group._id === groupId ? data.group : group));
                setSelectedGroup(data.group);
            } else toast.error(data.message);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const removeGroupMember = async (groupId, userId) => {
        try {
            const { data } = await axios.delete(`/api/groups/${groupId}/members/${userId}`);
            if (data.success) {
                setGroups((previous) => previous.map((group) => group._id === groupId ? { ...group, members: group.members.filter((member) => String(member._id) !== String(userId)) } : group));
                setSelectedGroup((group) => group?._id === groupId ? { ...group, members: group.members.filter((member) => String(member._id) !== String(userId)) } : group);
            } else toast.error(data.message);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const deleteGroup = async (groupId) => {
        try {
            const { data } = await axios.delete(`/api/groups/${groupId}`);
            if (data.success) {
                setGroups((previous) => previous.filter((group) => group._id !== groupId));
                setSelectedGroup(null);
            } else toast.error(data.message);
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Function to subscribe to messages for selected user
    const subscribeToMessages = async () => {
        if (!socket) return;

        socket.on("newMessage", (newMessage) => {
            if (selectedUser && newMessage.senderId === selectedUser._id) {
                newMessage.seen = true;
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            } else {
                setUnseenMessages((prevUnseenMessages) => ({
                    ...prevUnseenMessages,
                    [newMessage.senderId]: prevUnseenMessages[newMessage.senderId]
                        ? prevUnseenMessages[newMessage.senderId] + 1
                        : 1,
                }));
            }
        });

        socket.on("newGroupMessage", (newMessage) => {
            if (selectedGroup && String(newMessage.groupId) === String(selectedGroup._id)) {
                const senderId = newMessage.senderId?._id || newMessage.senderId;
                if (String(senderId) !== String(authUser?._id)) {
                    setGroupMessages((previous) => [...previous, newMessage]);
                }
            }
        });

        socket.on("groupCreated", (group) => {
            if (group.members.some((member) => String(member._id || member) === String(authUser?._id))) {
                setGroups((previous) => previous.some((item) => item._id === group._id) ? previous : [group, ...previous]);
            }
        });

        socket.on("groupUpdated", (group) => {
            setGroups((previous) => previous.map((item) => item._id === group._id ? group : item));
            setSelectedGroup((current) => current?._id === group._id ? group : current);
        });

        socket.on("groupMemberAdded", (group) => {
            setGroups((previous) => previous.map((item) => item._id === group._id ? group : item));
        });

        socket.on("groupMemberRemoved", ({ groupId, userId }) => {
            if (String(userId) === String(authUser?._id)) {
                setGroups((previous) => previous.filter((group) => group._id !== groupId));
                setSelectedGroup((current) => current?._id === groupId ? null : current);
            }
        });

        socket.on("groupDeleted", (groupId) => {
            setGroups((previous) => previous.filter((group) => group._id !== groupId));
            setSelectedGroup((current) => current?._id === groupId ? null : current);
        });
    };

    // Function to unsbscribe from messages
    const unsubscribeFromMessages = () => {
        if (!socket) return;
        ["newMessage", "newGroupMessage", "groupCreated", "groupUpdated", "groupMemberAdded", "groupMemberRemoved", "groupDeleted"].forEach((event) => socket.off(event));
    };

    useEffect(() => {
        subscribeToMessages();
        return () => unsubscribeFromMessages();
    }, [socket, selectedUser, selectedGroup, authUser]);

    useEffect(() => {
        if (socket && selectedGroup) {
            socket.emit("joinGroup", selectedGroup._id);
            return () => socket.emit("leaveGroup", selectedGroup._id);
        }
    }, [socket, selectedGroup]);

    useEffect(() => {
        if (authUser) {
            getUsers();
            getGroups();
        }
    }, [authUser, onlineUsers]);

    const value = {
        messages,
        users,
        groups,
        selectedUser,
        selectedGroup,
        groupMessages,
        getUsers,
        getGroups,
        getMessages,
        getGroupMessages,
        sendMessage,
        sendGroupMessage,
        createGroup,
        leaveGroup,
        updateGroup,
        addGroupMembers,
        removeGroupMember,
        deleteGroup,
        setSelectedUser,
        setSelectedGroup,
        unseenMessages,
        setUnseenMessages,
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};