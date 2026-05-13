import { Request, Response } from "express";
import { authenticateUser } from "../services/authService";

export const authController = {
  login: async (req: Request, res: Response) => {
    const email = req.body?.email;
    const pin = req.body?.pin;
    if (!email || !pin) {
      return res.status(400).json({ message: "Email and PIN are required" });
    }
    const response = await authenticateUser(email, pin);
    return res.status(response.status).json({
      message: response.message,
      token: response.token,
    });
  }
};
