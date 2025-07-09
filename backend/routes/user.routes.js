import e from "express";
import protectedRoutes from "../middleware/protectedRoutes.js";
import {
  getFilteredUsers,
  getMe,
  updateUser,
} from "../controllers/user.controller.js";

const router = e.Router();
router.get("/", protectedRoutes, getFilteredUsers);
router.get("/me", protectedRoutes, getMe);
router.post("/update", protectedRoutes, updateUser);

export default router;
