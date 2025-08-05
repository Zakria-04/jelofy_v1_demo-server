import { Router } from "express";
import { sendSupportEmail } from "../Controllers/email.controller";

const emailRouter = Router();

emailRouter.post("/sendEmailSupport", sendSupportEmail);

export default emailRouter;
