import User from "../models/user.model.js";
import genToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

export const signupUser = async (req, res) => {
  try {
    const { fullname, username, gender, password } = req.body;
    if (fullname === "")
      return res.status(400).json({ error: "Provide Full Name" });

    const existingUsername = await User.findOne({ username });
    if (existingUsername)
      return res.status(400).json({ error: "Username Already Used" });

    if (password.length < 6)
      return res.status(400).json({ error: "Password minimum 6 character" });

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      fullname,
      username,
      gender,
      password: hashPassword,
      profileImg: gender === "male" ? boyProfilePic : girlProfilePic,
    });
    if (newUser) {
      genToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullname: newUser.fullname,
        bio: newUser.bio,
        username: newUser.username,
        gender: newUser.gender,
        profileImg: newUser.profileImg,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "error in Sign Up User" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "User Not Found" });
    if (password.length < 6)
      return res
        .status(400)
        .json({ error: "Password needs minimum 6 characters" });

    const correctPassword = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (correctPassword !== true)
      return res
        .status(400)
        .json({ error: "email or Password is not correct" });

    await genToken(user._id, res);

    res.status(201).json({
      _id: user._id,
      fullname: user.fullname,
      bio: user.bio,
      username: user.username,
      gender: user.gender,
      profileImg: user.profileImg,
    });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(201).json({ message: "Logout successfully" });
  } catch (error) {
    console.log(error);
  }
};
