import { Router } from "express";
import {
  createNewMeal,
  deleteMeal,
  getAllUserMeals,
  getAllUserRestaurantMeals,
  getMealById,
  updateMeal,
  updateMealTranslation,
} from "../Controllers/meal.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import upload from "../middleware/multer";

const mealRouter = Router();

mealRouter.get("/meals", authenticateToken, getAllUserMeals);
mealRouter.get("/meal/:id", getMealById);
mealRouter.post(
  "/create-meal",
  authenticateToken,
  upload.single("image"),
  createNewMeal
);
mealRouter.patch(
  "/updateMeal/:id",
  authenticateToken,
  upload.single("image"),
  updateMeal
);
mealRouter.delete("/deleteMeal/:id", authenticateToken, deleteMeal);

mealRouter.get(
  "/getAllUserRestaurantMeals/:restaurantId",
  authenticateToken,
  getAllUserRestaurantMeals
);

mealRouter.patch("/meal/:mealId/translation", updateMealTranslation);

export default mealRouter;
