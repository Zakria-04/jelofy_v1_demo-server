import { Request, Response } from "express";
import TEMPLATE_UI_CONFIG from "../Models/templateUiConfig.model";
import serverError from "../../utils/errorMessage";
import { startupTemplateUiConfig } from "../../utils/templateUIConfig";

const uiTemplateConfig = async (req: Request, res: Response) => {
  try {
    const uiConfig = [
      // General
      {
        key: "background color",
        inputType: "color",
        groupKey: "General",
        labelKey: "ui.backgroundColor.label",
        path: "backgroundColor.color",
        defaultValue: "background color",
      },
      // {
      //   key: "background image",
      //   inputType: "file",
      //   groupKey: "General",
      //   labelKey: "ui.backgroundImage.label",
      //   path: "backgroundImage.url",
      //   defaultValue: "background image",
      // },

      // Header
      {
        key: "background color",
        inputType: "color",
        groupKey: "Header",
        labelKey: "ui.header.logoText.label",
        path: "header.backgroundColor.color",
        defaultValue: "logo text",
      },
      {
        key: "Logo text",
        inputType: "text",
        groupKey: "Header",
        labelKey: "ui.header.logoText.label",
        path: "header.logoText.name",
        defaultValue: "logo text",
      },
      {
        key: "Logo picture",
        inputType: "file",
        groupKey: "Header",
        labelKey: "ui.header.logoText.label",
        path: "header.logoUrl.url",
        defaultValue: "logo text",
      },
      {
        key: "contact information",
        inputType: "text",
        groupKey: "Header",
        labelKey: "ui.header.contactInformation.label",
        path: "header.contactInformation.name",
      },
      {
        key: "contact phone",
        inputType: "text",
        groupKey: "Header",
        labelKey: "ui.header.contactInformation.label",
        path: "header.contactInformation.phone",
      },
      {
        key: "contact icon color",
        inputType: "color",
        groupKey: "Header",
        labelKey: "ui.header.contactInformation.label",
        path: "header.contactInformation.iconColor",
      },
      {
        key: "contact text color",
        inputType: "color",
        groupKey: "Header",
        labelKey: "ui.header.contactInformation.label",
        path: "header.contactInformation.color",
      },

      // category
      {
        key: "selected category background color",
        inputType: "color",
        groupKey: "Category",
        labelKey: "ui.category.backgroundColor.label",
        path: "category.backgroundColorSelected.color",
      },
      {
        key: "unselected category background color",
        inputType: "color",
        groupKey: "Category",
        labelKey: "ui.category.backgroundColor.label",
        path: "category.backgroundColor.color",
      },
      {
        key: "selected border",
        inputType: "color",
        groupKey: "Category",
        labelKey: "ui.category.backgroundColor.label",
        path: "category.borderSelected.color",
      },
      {
        key: "unselected border",
        inputType: "color",
        groupKey: "Category",
        labelKey: "ui.category.backgroundColor.label",
        path: "category.borderSelected.color",
      },
      {
        key: "selected text color",
        inputType: "color",
        groupKey: "Category",
        labelKey: "ui.category.textColor.label",
        path: "category.textColorSelected.color",
      },
      {
        key: "text color",
        inputType: "color",
        groupKey: "Category",
        labelKey: "ui.category.textColor.label",
        path: "category.textColor.color",
      },

      // meals container box
      {
        key: "background color",
        inputType: "color",
        groupKey: "Meal Box",
        labelKey: "ui.category.textColor.label",
        path: "mealsContainer.backgroundColor.color",
      },
      {
        key: "meal name",
        inputType: "color",
        groupKey: "Meal Box",
        labelKey: "ui.category.textColor.label",
        path: "mealsContainer.mealName.color",
      },
      // {
      //   key: "meal image size",
      //   inputType: "color",
      //   groupKey: "Meal Box",
      //   labelKey: "ui.category.textColor.label",
      //   path: "mealsContainer.mealName.color",
      // },
      {
        key: "meal description",
        inputType: "color",
        groupKey: "Meal Box",
        labelKey: "ui.category.textColor.label",
        path: "mealsContainer.mealDescription.color",
      },
      {
        key: "meal price",
        inputType: "color",
        groupKey: "Meal Box",
        labelKey: "ui.category.mealPrice.label",
        path: "mealsContainer.mealPrice.color",
      },
      {
        key: "mealQuantity",
        inputType: "color",
        groupKey: "Meal Box",
        labelKey: "ui.category.mealQuantity.label",
        path: "mealsContainer.mealPrice.color",
      },
      {
        key: "meal border",
        inputType: "color",
        groupKey: "Meal Box",
        labelKey: "ui.category.mealBorder.label",
        path: "mealsContainer.mealBorder.color",
      },
    ];

    const templateConfig = await TEMPLATE_UI_CONFIG.findOneAndUpdate(
      {},
      { _ui: uiConfig },
      { new: true, upsert: true }
    );

    res.status(200).json(templateConfig);
  } catch (error) {
    serverError(error, res);
  }
};

const createAndUpdateUiTemplateConfig = async (req: Request, res: Response) => {
  try {
    const { templateName } = req.body;

    const defaultUiConfig =
      startupTemplateUiConfig[
        templateName as keyof typeof startupTemplateUiConfig
      ];

    const existingConfig = await TEMPLATE_UI_CONFIG.findOneAndUpdate(
      { templateName },
      { _ui: defaultUiConfig },
      { new: true, upsert: true }
    );

    if (!existingConfig) {
      res.status(404).json({ message: "Template UI config not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Template UI config updated successfully",
      ui: existingConfig._ui,
    });
  } catch (error) {
    serverError(error, res);
  }
};

const getUiTemplateConfig = async (req: Request, res: Response) => {
  try {
    const { templateName } = req.query;
    if (!templateName || typeof templateName !== "string") {
      res.status(400).json({ message: "Template name is required" });
      return;
    }
    const templateConfig = await TEMPLATE_UI_CONFIG.findOne({ templateName });
    if (!templateConfig) {
      res.status(404).json({ message: "Template UI config not found" });
      return;
    }
    res.status(200).json({ ui: templateConfig._ui });
  } catch (error) {
    serverError(error, res);
  }
};

export {
  uiTemplateConfig,
  getUiTemplateConfig,
  createAndUpdateUiTemplateConfig,
};
