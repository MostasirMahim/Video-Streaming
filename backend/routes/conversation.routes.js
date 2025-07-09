import e from "express";
import protectedRoutes from "./../middleware/protectedRoutes.js";
import {
  getCoversation,
  getMessage,
  sendMessage,
} from "../controllers/coversation.controller.js";

const router = e.Router();

router.get("/:id", protectedRoutes, getMessage);
router.post("/send/:id", protectedRoutes, sendMessage);
router.get("/conversation/:id", protectedRoutes, getCoversation);

export default router;
