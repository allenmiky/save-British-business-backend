import { Router } from "express";
import { findMPByPostcode } from "../controllers/mpController.js";

const router = Router();

// POST /api/find
router.post("/find", findMPByPostcode);

export default router;
