import { Server } from "socket.io";
import http from "http";
import e from "express";
import cors from "cors";
const app = e();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const userSocketMap = {};
const groupSocketMap = {};

io.on("connection", (socket) => {
  
  console.log("a user connected", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId != "undefined") userSocketMap[userId] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  // Join a group (add user to a group map)
  socket.on("joinGroup", (groupId) => {
    groupSocketMap[groupId] = groupSocketMap[groupId] || [];
    
    if (!groupSocketMap[groupId].includes(socket.id)) {
      groupSocketMap[groupId].push(socket.id);
      socket.join(groupId); // Join the group room in socket.io
    }

    // Emit to the group that a user has joined
    io.to(groupId).emit("userJoined", { userId, groupId });
  });
     // Listen for group messages
  socket.on("sendGroupMessage", ({ groupId, message, senderId }) => {
    io.to(groupId).emit("newGroupMessage", { message, senderId });
  });

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

       // Remove user from any group they belong to
       for (const group in groupSocketMap) {
        groupSocketMap[group] = groupSocketMap[group].filter(socketId => socketId !== socket.id);
        if (groupSocketMap[group].length === 0) {
          delete groupSocketMap[group]; // Clean up if no users are in the group
        }
      }
  });
});

export { app, io, server };
