import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.ts";
import historyRoutes from "./routes/historyRoute.ts";
import leaderboardRoutes from "./routes/leaderboardRoute.ts";
import profileRoutes from "./routes/profileRoute.ts";
export const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/update-profile", profileRoutes);