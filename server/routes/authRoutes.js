import express from "express";
import { registerNewFamily, registerJoinFamily, loginUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register/new", registerNewFamily);
router.post("/register/join", registerJoinFamily);
router.post("/login", loginUser);

export default router;