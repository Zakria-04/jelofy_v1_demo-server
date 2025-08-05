import { Router } from "express";
import { sseHandler, sseHandlerOwner } from "../../utils/sse";
import { authenticateToken } from "../middleware/auth.middleware";

const useSSERouter = Router();

useSSERouter.get("/sse/:restaurantId", sseHandler);

useSSERouter.get(
  "/sse/owner/:restaurantId",
  sseHandlerOwner
);

export default useSSERouter;
