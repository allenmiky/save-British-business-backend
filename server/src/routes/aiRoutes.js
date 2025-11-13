import express from "express";
import { regenerateEmailController } from "../controllers/aiController.js";

const router = express.Router();

// Route for AI email regeneration
router.post("/regenerate", regenerateEmailController);

export default router;
