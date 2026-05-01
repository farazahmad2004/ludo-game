import type { Request, Response } from "express";
import { Game } from "../models/Game.ts";

export const getHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.cookies.auth_token;
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const games = await Game.find({
      status: "finished",
      "players.user_id": userId,
    })
      .sort({ finished_at: -1 })
      .lean();

    const history = games.map((g) => {
      const finishOrder: Array<{
        userId: string;
        username: string;
        color: string;
      } | null> = [null, null, null, null];

      g.players.forEach((p) => {
        if (p.rank && p.rank >= 1 && p.rank <= 4) {
          finishOrder[p.rank - 1] = {
            userId: p.user_id?.toString() ?? "",
            username: p.username ?? "",
            color: p.color ?? "",
          };
        }
      });

      const me = g.players.find((p) => String(p.user_id) === String(userId));

      return {
        id: g._id.toString(),
        totalPlayers: g.total_players,
        finishedAt: g.finished_at ?? g.started_at ?? null,
        finishOrder,
        myCoins: me?.coins_earned ?? 0,
      };
    });

    return res.status(200).json({ games: history });
  } catch (error) {
    console.error("Error in getHistory:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};