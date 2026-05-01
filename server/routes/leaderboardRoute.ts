import { Router } from "express";
import { getLeaderboard } from "../controllers/leaderboardController.ts";

const router = Router();
router.get("/", getLeaderboard);

export default router;