import express from "express";
import { addItem, getItems, deleteItem } from "../controllers/listController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getItems);
router.post("/add", auth, addItem);
router.delete("/:id", auth, deleteItem);

export default router;