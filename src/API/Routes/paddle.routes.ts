import express from "express";
import { Router } from "express";
import {
  handlePaddleWebhook,
  saveCheckoutId,
} from "../Controllers/paddle.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const paddleRouter = Router();
paddleRouter.post("/saveCheckoutId", authenticateToken, saveCheckoutId);
paddleRouter.post("/webhook", express.json(), handlePaddleWebhook);

export default paddleRouter;
