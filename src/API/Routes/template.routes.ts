import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import {
  createNewTemplate,
  findUserSelectedTheme,
  getAllUserOwnedTemplates,
  updateRestaurantLogo,
  updateTemplate,
} from "../Controllers/template.controller";
import upload from "../middleware/multer";

const templateRouter = Router();

templateRouter.get(
  "/selectedTheme/:themeId",
  authenticateToken,
  findUserSelectedTheme
);
templateRouter.post("/createNewTemplate", authenticateToken, createNewTemplate);
templateRouter.get(
  "/getAllUserOwnedTemplates",
  authenticateToken,
  getAllUserOwnedTemplates
);
templateRouter.patch(
  "/updateTemplate/:templateId",
  authenticateToken,
  updateTemplate
);

templateRouter.patch(
  "/updateRestaurantLogo/:templateId",
  authenticateToken,
  upload.single("image"),
  updateRestaurantLogo
);
export default templateRouter;
