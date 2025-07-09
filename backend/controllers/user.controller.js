import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

export const getFilteredUsers = async (req, res) => {
  try {
    const userID = req.user._id;
    const filtereduser = await User.find({ _id: { $ne: userID } }).select(
      "-password"
    );
    res.status(201).json(filtereduser);
  } catch (error) {
    throw new Error(error);
  }
};
export const getMe = async (req, res) => {
  try {
    const userId = req.user?._id;
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ error: "User Not Authenticated" });
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullname, bio, profileImg, username, oldPassword, newPassword } =
      req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User Not Found" });
    if (profileImg) {
      //Upload a new Image
      const uploadResult = await cloudinary.uploader.upload(profileImg);
      user.profileImg = uploadResult.secure_url;
    }

    if (username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername)
        return res.status(400).json({ error: "Username already used" });
    }
    if (oldPassword && newPassword) {
      const isCorrect = await bcrypt.compare(oldPassword, user?.password || "");
      if (!isCorrect)
        return res.status(400).json({ error: "Password is not correct" });
      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ error: "Password Atleast need 6 character" });
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(newPassword, salt);

      user.password = hash;
    }

    user.fullname = fullname || user.fullname;
    user.username = username || user.username;
    user.bio = bio || user.bio;

    await user.save();
    user.password = null;
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    throw new Error("error in update User Function");
  }
};
