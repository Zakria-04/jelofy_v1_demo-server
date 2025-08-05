// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";

// export const authenticateToken = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

//   if (!token) {
//     res.status(401).json({ message: "Access token is required" });
//     return;
//   }

//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, user) => {
//     if (err) {
//       res.status(403).json({ message: "Invalid or expired token" });
//       return;
//     }
//     (req as any).user = user;
//     next();
//   });
// };

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. Get token from the cookies (not from the authorization header)
  const token = req.cookies.accessToken;

  // 2. If no token is found, return an error
  // if (!token) {
  //   res.status(401).json({ message: "Access token is required" });
  //   return;
  // }

  // 3. Verify the token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err: any, user: any) => {
    if (err) {
      res.status(403).json({ message: "Invalid or expired token" });
      return;
    }

    // Attach user info to the request object
    (req as any).user = user;

    // Continue to the next middleware or route handler
    next();
  });
};
