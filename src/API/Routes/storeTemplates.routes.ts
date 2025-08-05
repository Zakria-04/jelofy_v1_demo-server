import { Router } from "express";
import {
  createNewStoreTemplate,
  getAllStoreTemplates,
  purchaseTemplate,
  useTemplateToRestaurant,
} from "../Controllers/storeTemplate.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const storeTemplatesRouter = Router();

storeTemplatesRouter.get("/getAllStoreTemplates", getAllStoreTemplates);
storeTemplatesRouter.post("/createStoreTemplate", createNewStoreTemplate);
storeTemplatesRouter.post(
  "/purchaseTemplate/:templateId",
  authenticateToken,
  purchaseTemplate
);
storeTemplatesRouter.post(
  "/useTemplateOnRestaurant",
  authenticateToken,
  useTemplateToRestaurant
);

export default storeTemplatesRouter;
