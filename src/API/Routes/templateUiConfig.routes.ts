import { Router } from "express";
import { createAndUpdateUiTemplateConfig, getUiTemplateConfig, uiTemplateConfig } from "../Controllers/templateUiConfig.controller";

const templateUiConfigRouter = Router();

templateUiConfigRouter.patch("/template-ui-config", uiTemplateConfig);
templateUiConfigRouter.get("/getTemplateUiConfig", getUiTemplateConfig);
templateUiConfigRouter.patch("/templateUiConfig", createAndUpdateUiTemplateConfig);

export default templateUiConfigRouter;
