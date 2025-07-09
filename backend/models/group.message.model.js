import mongoose from "mongoose";

const groupMessageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
  text: { type: String, required: true },
  img: { type: String, default: "" }, // Optional image field
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("GroupMessage", groupMessageSchema);
