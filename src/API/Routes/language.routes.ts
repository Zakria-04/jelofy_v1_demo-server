import { Router } from "express";
import { getLanguage, upsertLanguage } from "../Controllers/language.controller";

const languageRouter = Router();

languageRouter.patch("/modifyLanguage", upsertLanguage)
languageRouter.get("/getLanguage/:lang", getLanguage)

export default languageRouter;