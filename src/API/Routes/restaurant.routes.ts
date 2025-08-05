import { Router } from "express";
import {
  addOrUpdateRestaurantCurrency,
  addOrUpdateRestaurantLanguages,
  checkIfBusinessUrlExists,
  createNewRestaurant,
  createRestaurantAndTemplate,
  deleteRestaurantLanguage,
  deleteUserRestaurant,
  findRestaurantByURL,
  findUserRestaurants,
  toggleRestaurantActiveStatus,
  updateRestaurantDetails,
  updateRestaurantLanguages,
  updateRestaurantSelectedLanguage,
} from "../Controllers/restaurant.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import upload from "../middleware/multer";

const restaurantRouter = Router();

restaurantRouter.get("/store/:businessUrl", findRestaurantByURL);
restaurantRouter.get(
  "/findUserRestaurants",
  authenticateToken,
  findUserRestaurants
);
restaurantRouter.post(
  "/createRestaurant",
  authenticateToken,
  createNewRestaurant
);
restaurantRouter.post(
  "/createRestaurantAndTemplate",
  authenticateToken,
  createRestaurantAndTemplate
);

restaurantRouter.patch(
  "/toggleRestaurantActiveStatus/:restaurantId",
  authenticateToken,
  toggleRestaurantActiveStatus
);

restaurantRouter.patch(
  "/restaurants/:restaurantId/languages",
  authenticateToken,
  updateRestaurantLanguages
);

restaurantRouter.patch(
  "/updateRestaurantDetails/:restaurantId",
  authenticateToken,
  updateRestaurantDetails
);

restaurantRouter.patch(
  "/addOrUpdateRestaurantLanguages/:restaurantId",
  authenticateToken,
  addOrUpdateRestaurantLanguages
);

restaurantRouter.delete(
  "/deleteRestaurantLanguage/:restaurantId",
  authenticateToken,
  deleteRestaurantLanguage
);

restaurantRouter.delete(
  "/deleteUserRestaurant/:restaurantId",
  authenticateToken,
  deleteUserRestaurant
);

restaurantRouter.get("/check-url", checkIfBusinessUrlExists);

restaurantRouter.patch(
  "/updateRestaurantSelectedLanguage/:restaurantId",
  authenticateToken,
  upload.single("icon"),
  updateRestaurantSelectedLanguage
);

restaurantRouter.patch(
  "/updateRestaurantCurrency/:restaurantId",
  authenticateToken,
  addOrUpdateRestaurantCurrency
);

export default restaurantRouter;
