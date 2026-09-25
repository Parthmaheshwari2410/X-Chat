import express from "express"
import { protectroutes } from "../middleware/auth.js";
import { getMessages, getUsersForSidebar, markMessageAsSeen, sendMessage } from "../controllers/messageController.js";

const messageRouter = express.Router();
messageRouter.get("/users", protectroutes, getUsersForSidebar)
messageRouter.get("/:id", protectroutes, getMessages)
messageRouter.put("/mark/:id", protectroutes, markMessageAsSeen)
messageRouter.post("/send/:id", protectroutes, sendMessage)
export default messageRouter;