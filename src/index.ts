import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import Routes from "./API/Routes/Router";
import "./config/passport";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
// app.use(cors());

const allowedOrigins = [
  "http://localhost:3000",
  "https://www.jelofy.com",
  // "https://api-jelofy.up.railway.app",
  "https://api.jelofy.com"

] as string[];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    // methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    // allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use("/", Routes);

const DB_URL = process.env.DB_URL;

if (!DB_URL) {
  throw new Error("DB_URL is not defined in .env file");
}

mongoose.connect(DB_URL);
mongoose.connection.on("connected", () => {
  console.log("MongoDB connected successfully");
});
mongoose.connection.on("error", (err) => {
  console.error("Failed to connect to MongoDB", err);
});

// server connectivity check
app.get("/server-health", (req, res) => {
  res.json({ live: true });
});

export default app;
