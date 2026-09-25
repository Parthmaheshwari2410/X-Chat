import mongoose from "mongoose";

const groupMessageSchema = new mongoose.Schema(
    {
        groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, trim: true },
        image: { type: String },
        seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true }
);

groupMessageSchema.index({ groupId: 1, createdAt: 1 });

const GroupMessage = mongoose.model("GroupMessage", groupMessageSchema);
export default GroupMessage;
