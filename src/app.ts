import express from 'express';
import { authController } from './controllers/authController';

export const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
  });
});

app.post("/auth/login", authController.login);
