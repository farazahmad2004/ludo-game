import type { Request, Response } from "express";
import { User } from "../models/User.ts";

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.cookies.auth_token;
    
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { username, dob, currentPassword, newPassword } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (newPassword) {
      if (user.password !== currentPassword) {
        return res.status(400).json({ error: "Incorrect current password" });
      }
      user.password = newPassword;
    }

    if (username) {
      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({ error: "Username already taken" });
      }
      user.username = username;
    }

    if (dob) {
      user.dob = dob;
    }

    await user.save();

    return res.status(200).json({ 
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        username: user.username,
        coins: user.coins,
        total_played: user.total_played
      }
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};