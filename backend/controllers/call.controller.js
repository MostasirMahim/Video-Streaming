import { AccessToken } from "livekit-server-sdk";
import User from "../models/user.model.js";

const createToken = async (req, res) => {
  const roomName = req.query.room;
  const user = await User.findById(req.user._id);
  if (!user || !roomName) {
    return res.status(404).json({ error: "User Or Room not found" });
  }

  const participantName = user?.username;
  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    {
      identity: participantName,
      ttl: "10m",
    }
  );

  at.addGrant({ roomJoin: true, room: roomName });

  const token = await at.toJwt();
  res.json({ token });
};

export default createToken;
