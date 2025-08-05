import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer TOKEN

    if (!token) {
       res.status(401).json({ message: "Unauthorized" });
       return
    }

    // Verify token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
