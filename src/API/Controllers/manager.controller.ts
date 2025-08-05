import { Request, Response } from "express";
import MEAL_MODEL from "../Models/meals.model";
import serverError from "../../utils/errorMessage";

const toggleMealActivity = async (req: Request, res: Response) => {
  const { mealID } = req.body;

  try {
    // Assuming you have a Meal model to interact with your database
    const meal = await MEAL_MODEL.findById(mealID);
    if (!meal) {
      res.status(404).json({ error: "Meal not found" });
      return;
    }

    meal.isAvailable = !meal.isAvailable;
    await meal.save();

    res.status(200).json({ success: true, meal, _id: meal._id });
  } catch (error) {
    serverError(error, res);
  }
};

export { toggleMealActivity };
