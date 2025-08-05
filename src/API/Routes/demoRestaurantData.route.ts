import { Router } from "express";
import  demoMeals  from "../../utils/startupMeals";

const demoRestaurantData = Router();

demoRestaurantData.get("/demoMeals", (req, res) => {
  res.status(200).json(demoMeals);
});

export default demoRestaurantData;
