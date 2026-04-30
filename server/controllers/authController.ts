import type { Request, Response } from "express";
import { User } from "../models/User.ts";
export const signup = async (req: Request, res: Response) => {
  try {
    const { username, dob, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already taken" });
    }
    const newUser = new User({
      username,
      dob,
      password,
      coins: 100
    });
    await newUser.save();
    res.cookie("auth_token", newUser._id.toString(), {
      httpOnly: true,
      sameSite: "lax"
    });
    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.log("Error during signup");
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    res.cookie("auth_token", user._id.toString(), {
      httpOnly: true,
      sameSite: "lax"
    });
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.log("Error during login");
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const user = await User.findById(token).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getMe");
    res.status(500).json({ error: "Internal server error" });
  }
};
export const logout = (req: Request, res: Response) => {
  res.clearCookie("auth_token", {
    httpOnly: true,
    sameSite: "lax"
  });
  res.status(200).json({ message: "Logout successful" });
};
// Response code summary:
// 200 OK: Request succeeded.
// 201 Created: Resource created (e.g., POST/PUT).
// 202 Accepted: Request accepted but processing not complete.
// 203 Non-Authoritative Information: Returned meta-data is from a third party.
// 204 No Content: Request successful, but no content to send back.
// 205 Reset Content: Instructs client to reset the document view.
// 206 Partial Content: Delivering only part of a resource (range request).
// 400 Bad Request: Server cannot understand request due to client error.
// 401 Unauthorized: Authentication is required and failed/missing.
// 402 Payment Required: Reserved for future use.
// 403 Forbidden: Server understands request but refuses to authorize.
// 404 Not Found: Resource not found.
// 405 Method Not Allowed: HTTP method not supported for this resource.