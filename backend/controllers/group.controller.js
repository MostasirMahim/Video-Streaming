import Group from "../models/group.model.js";
import GroupMessage from "../models/group.message.model.js";
import { io } from "../socket/socket.js";
import User from "../models/user.model.js";

// Create a new group
export const createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;
    const createdBy = req.user._id;

    if (!name || !members || !createdBy) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    let users = [createdBy];
    for (const memberId of members) {
      const user = await User.findById(memberId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      users.push(user);
    }

    const newGroup = await Group.create({
      name,
      members: users,
      createdBy,
    });

    res.status(201).json(newGroup);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create group" });
  }
};

// Send message to a group
export const sendGroupMessage = async (req, res) => {
  try {
    const { text, img } = req.body;
    const { groupId } = req.params;
    const senderId = req.user._id;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    const newMessage = await GroupMessage.create({
      senderId,
      groupId,
      text,
      img: img || "",
    });

    group.messages.push(newMessage._id);
    await group.save();

    // Broadcast the message to all members in the group
    group.members.forEach((memberId) => {
      const receiverSocketId = getReceiverSocketId(memberId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newGroupMessage", newMessage);
      }
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
};

// Delete a group
export const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    await group.remove();
    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete group" });
  }
};

export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params; // Get the group ID from the request parameters
    const group = await Group.findById(groupId).populate("messages"); // Find the group and populate messages

    if (!group) return res.status(404).json({ error: "Group not found" }); // Return an error if the group doesn't exist

    // Get the messages from the group
    res.status(200).json(group); // Return the messages
  } catch (error) {
    res.status(500).json({ error: "Internal server error" }); // Handle any errors
  }
};

export const getUserGroups = async (req, res) => {
  try {
    const userId = req.user._id; // Get the user ID from the request
    const groups = await Group.find({
      $or: [{ members: userId }, { createdBy: userId }],
    }) // Find groups where the user is a member
      .populate("members", "name profileImg") // Populate member details
      .populate("createdBy", "name profileImg"); // Populate creator details

    res.status(200).json(groups); // Return the groups
  } catch (error) {
    res.status(500).json({ error: "Internal server error" }); // Handle any errors
  }
};
