import authRouter from "./auth.routes";
import demoRestaurantData from "./demoRestaurantData.route";
import emailRouter from "./email.routes";
import languageRouter from "./language.routes";
import managerRouter from "./manager.routes";
import mealRouter from "./meal.routes";
import paddleRouter from "./paddle.routes";
import restaurantRouter from "./restaurant.routes";
import useSSERouter from "./sse.routes";
import storeTemplatesRouter from "./storeTemplates.routes";
import subscriberRouter from "./subscriber.routes";
import subscriptionPlanRouter from "./subscriptionPlan.routes";
import templateRouter from "./template.routes";
import templateUiConfigRouter from "./templateUiConfig.routes";
import userRouter from "./user.routes";

const Routes = [
  userRouter,
  mealRouter,
  restaurantRouter,
  templateRouter,
  authRouter,
  storeTemplatesRouter,
  subscriptionPlanRouter,
  templateUiConfigRouter,
  useSSERouter,
  languageRouter,
  demoRestaurantData,
  emailRouter,
  subscriberRouter,
  managerRouter,
  paddleRouter
];

export default Routes;
