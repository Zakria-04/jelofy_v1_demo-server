import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export const generateAccessToken = (tokenData: any) => {
  return jwt.sign(tokenData, ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (tokenData: any) => {
  return jwt.sign(tokenData, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};
