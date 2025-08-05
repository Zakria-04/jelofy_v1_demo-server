import { Router } from "express";
import {
  createNewSubscriptionPlan,
  getAllSubscriptionPlans,
  getSelectedLanguageSubscriptionPlan,
  updateSubscriptionPlan,
  userPaddleConformationPlanOrder,
} from "../Controllers/subscriptionPlan.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const subscriptionPlanRouter = Router();

subscriptionPlanRouter.post(
  "/createSubscriptionPlan",
  createNewSubscriptionPlan
);

subscriptionPlanRouter.patch(
  "/updateSubscriptionPlan/:planId",
  updateSubscriptionPlan
);

subscriptionPlanRouter.get("/getAllSubscriptionPlans", getAllSubscriptionPlans);

subscriptionPlanRouter.get(
  "/getSelectedLanguageSubscriptionPlans/:language",
  getSelectedLanguageSubscriptionPlan
);

subscriptionPlanRouter.post(
  "/subscriptionPlanConformationAndUpdate/:planId",
  authenticateToken,
  userPaddleConformationPlanOrder
);
export default subscriptionPlanRouter;
