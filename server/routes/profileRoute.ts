import { Router } from "express";
import { updateProfile } from "../controllers/profileController.ts";

const router = Router();
router.put("/", updateProfile);

export default router;