import { Router } from "express";
import {
  authenticateToken,
  changeUserPassword,
  checkIfRefreshTokenIsValidAndAvailableInDatabase,
  createManagerAccount,
  createNewUser,
  deleteUserAccount,
  editManagerDetails,
  getCurrentUser,
  getCurrentUserSubscriptionPlan,
  getOwnerManagers,
  loginManagerAccount,
  loginUser,
  logout,
  refreshToken,
  removeManager,
  updateUserInfo,
  updateUserName,
} from "../Controllers/user.controller";

declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}

const userRouter = Router();

userRouter.post("/register", createNewUser);
userRouter.post("/login", loginUser);
userRouter.post("/user/refresh-token", refreshToken);

userRouter.post("/createManager", authenticateToken, createManagerAccount);

// protected-route
userRouter.get("/auth/user", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", user: (req as any).user });
});

userRouter.get("/getCurrentUser", authenticateToken, getCurrentUser);

userRouter.get(
  "/getCurrentUserSubscriptionPlan",
  authenticateToken,
  getCurrentUserSubscriptionPlan
);

userRouter.get("/getOwnerManagers", authenticateToken, getOwnerManagers);

userRouter.post("/logout", logout);

userRouter.patch("/updateUserName", authenticateToken, updateUserName);

userRouter.get(
  "/checkIfUserLoggedIn",
  checkIfRefreshTokenIsValidAndAvailableInDatabase
);

userRouter.delete(
  "/deleteManager/:managerId",
  authenticateToken,
  removeManager
);

userRouter.patch(
  "/updateManagerDetails/:managerId",
  authenticateToken,
  editManagerDetails
);

userRouter.post("/login-manager", loginManagerAccount);

userRouter.patch("/updateUserInfo", authenticateToken, updateUserInfo);

userRouter.patch("/updateUserPassword", authenticateToken, changeUserPassword);

userRouter.delete("/deleteUserAccount", authenticateToken, deleteUserAccount)
// userRouter.get("/findCurrentUser", authenticateToken, findCurrentUser);

export default userRouter;
