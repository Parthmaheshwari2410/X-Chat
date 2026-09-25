import express from "express";
import { checkAuth, login, signup, updateProfile } from "../controllers/userController.js";
import { protectroutes } from "../middleware/auth.js";


const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.put("/update-profile", protectroutes, updateProfile);
userRouter.get("/check", protectroutes, checkAuth);

export default userRouter;