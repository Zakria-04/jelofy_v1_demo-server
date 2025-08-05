import { Router } from "express";
import { toggleMealActivity } from "../Controllers/manager.controller";

const managerRouter = Router();

managerRouter.patch("/toggleMealAvailability", toggleMealActivity);

export default managerRouter;
