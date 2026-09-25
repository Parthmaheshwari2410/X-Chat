import express from "express"
import "dotenv/config"
import cors from "cors"
import http from "http"
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoute.js";
import groupRouter from "./routes/groupRoute.js";
import Group from "./models/Group.js";
import { Server } from "socket.io";

//create Express app and http server
const app = express();
const server = http.createServer(app);

//Initialize socket.io server
export const io = new Server(server, {
    cors: { origin: "*" }
})

// store online Users 
export const userSocketMap = {}; //{ userId: soketId }

// Soket.io connection Handler 
io.on("connection", (socket) => {

    const userId = socket.handshake.query.userId;
    console.log("User Connected", userId);

    if (userId) userSocketMap[userId] = socket.id;

    // Emit online users to all connected client 
    io.emit("getOnlineUsers", Object.keys(userSocketMap))
    socket.on("joinGroup", async (groupId) => {
        const group = await Group.findOne({ _id: groupId, members: userId }).select("_id");
        if (group) socket.join(`group:${groupId}`);
    });

    socket.on("leaveGroup", (groupId) => {
        socket.leave(`group:${groupId}`);
    });

    socket.on("disconnect", () => {

        console.log("User Disconnected", userId)
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})



//Middleware setup
app.use(express.json({ limit: "4mb" }));
app.use(cors());


//routes setup
app.use("/api/status", (req, res) => res.send("Server is Live"))
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);
app.use("/api/groups", groupRouter);

await connectDB();
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log("Server is runnig on PORT: " + PORT))

