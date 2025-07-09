import e from "express";
import { login, logout, signupUser } from "../controllers/auth.controller.js";

const router = e.Router();

router.post("/signup", signupUser);
router.post("/login", login);
router.post("/logout", logout);

export default router;
