import type { Request, Response } from "express";
import { User } from "../models/User.ts";

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}, "username coins total_played")
      .sort({ coins: -1, total_played: 1 })
      .lean();

    return res.status(200).json({ leaderboard: users });
  } catch (error) {
    console.error("Error in getLeaderboard:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};