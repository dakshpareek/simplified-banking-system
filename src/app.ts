import express from 'express';
import { authController } from './controllers/authController';
import { walletController } from './controllers/walletController';
import { requireAuth } from './middleware/authMiddleware';

export const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
  });
});

app.post("/auth/login", authController.login);
app.get("/balance", requireAuth, walletController.getBalance);
app.post("/deposit", requireAuth, walletController.deposit);
