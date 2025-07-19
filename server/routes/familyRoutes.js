import express from "express";
import { getFamilyMembers } from "../controllers/familyController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/members", auth, getFamilyMembers);

export default router;