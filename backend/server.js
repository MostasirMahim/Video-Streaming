import express from "express";
import cookieparser from "cookie-parser";
import dotenv from "dotenv";
import connectMongoDb from "./database/connectMongoDB.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import conversationRoutes from "./routes/conversation.routes.js";
import { app, server } from "./socket/socket.js";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import groupsRoutes from './routes/group.routes.js'
import callRoutes from './routes/call.routes.js'

dotenv.config();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();
app.use(cookieparser());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", conversationRoutes);
app.use("/api/groups", groupsRoutes);
app.use("/api/call", callRoutes);




server.listen(PORT, () => {
  console.log("Volume Test is ok");
  console.log(`server is running on ${PORT}`);
  connectMongoDb();
});
