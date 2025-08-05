import { Request, Response } from "express";
import serverError from "../../utils/errorMessage";
import SUBSCRIPTION_PLAN_MODEL from "../Models/subscriptionPlan.model";
import USER_MODEL from "../Models/user.model";

const createNewSubscriptionPlan = async (req: Request, res: Response) => {
  try {
    const { planName, description, price, features, lang, priceId, nameId } = req.body;

    const newPlan = {
      lang,
      planName,
      nameId,
      description,
      price,
      priceId,
      features,
    };
    const subscriptionPlan = await SUBSCRIPTION_PLAN_MODEL.create(newPlan);
    if (!subscriptionPlan) {
      res.status(400).json({
        message: "Failed to create subscription plan",
      });
      return;
    }

    res.status(201).json({
      message: "Subscription plan created successfully",
      subscriptionPlan,
    });
  } catch (error) {
    serverError(error, res);
  }
};

const updateSubscriptionPlan = async (req: Request, res: Response) => {
  try {
    const { planId } = req.params;
    const { planName, description, price, features, lang } = req.body;

    const updatedPlan = await SUBSCRIPTION_PLAN_MODEL.findByIdAndUpdate(
      planId,
      {
        planName,
        lang,
        description,
        price,
        features,
      },
      { new: true }
    );

    if (!updatedPlan) {
      res.status(404).json({
        message: "Subscription plan not found",
      });
      return;
    }

    res.status(200).json({
      message: "Subscription plan updated successfully",
      updatedPlan,
    });
  } catch (error) {
    serverError(error, res);
  }
};

const getAllSubscriptionPlans = async (req: Request, res: Response) => {
  try {
    const subscriptionPlans = await SUBSCRIPTION_PLAN_MODEL.find();
    res.status(200).json({
      message: "Subscription plans retrieved successfully",
      subscriptionPlans,
    });
  } catch (error) {
    serverError(error, res);
  }
};

const getSelectedLanguageSubscriptionPlan = async (
  req: Request,
  res: Response
) => {
  try {
    const { language } = req.params;
    const subscriptionPlans = await SUBSCRIPTION_PLAN_MODEL.find({
      lang: language,
    });
    if (!subscriptionPlans) {
      res.status(404).json({
        message: "No subscription plans found for the selected language",
      });
      return;
    }
    res.status(200).json({
      message: "Subscription plans retrieved successfully",
      subscriptionPlans,
    });
  } catch (error) {
    serverError(error, res);
  }
};

const userPaddleConformationPlanOrder = async (req: Request, res: Response) => {
  try {
    const { planId } = req.params;
    const { userId } = req.body;

    const plan = await SUBSCRIPTION_PLAN_MODEL.findById(planId);
    if (!plan) {
      res.status(404).json({
        message: "Subscription plan not found",
      });
      return;
    }

    // updated user model with the plan details
    const user = await USER_MODEL.findByIdAndUpdate(
      userId,
      {
        plan: plan.planName,
        isPlanActive: true,
        planStartDate: new Date(),
        planEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
      { new: true }
    );

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }
    res.status(200).json({
      message: "User subscription plan updated successfully",
      user,
    });
  } catch (error) {
    serverError(error, res);
  }
};

export {
  createNewSubscriptionPlan,
  updateSubscriptionPlan,
  getAllSubscriptionPlans,
  getSelectedLanguageSubscriptionPlan,
  userPaddleConformationPlanOrder,
};
