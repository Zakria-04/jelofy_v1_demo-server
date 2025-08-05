import { Router } from "express";
import { createSubscriber } from "../Controllers/subscriber.controller";

const subscriberRouter = Router();

subscriberRouter.post("/subscribe", createSubscriber);

export default subscriberRouter;
