import { NextFunction, Request, Response } from "express";
import { User } from "../entities/User";
import { findUserByToken } from "../services/authService";

export interface AuthenticatedRequest extends Request {
  user: User;
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid Authorization header" });
  }

  const token = authHeader.slice("Bearer ".length).trim();
  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }

  const user = await findUserByToken(token);
  if (!user) {
    return res.status(401).json({ message: "Invalid token" });
  }

  (req as AuthenticatedRequest).user = user;
  return next();
}
