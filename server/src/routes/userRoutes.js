import express from "express";
import { createUser } from "../controllers/userController.js";

const router = express.Router();

// ✅ This will respond to: http://localhost:4000/api/users
router.post("/users", createUser);

export default router;
