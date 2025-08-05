import { Request, Response } from "express";
import serverError from "../../utils/errorMessage";
import TEMPLATE_MODEL from "../Models/template.model";
import STORE_TEMPLATES from "../Models/storeTemplates.model";
import { templateDefaults } from "../../utils/templateDefaults";
import USER_MODEL from "../Models/user.model";
import { merge } from "lodash";
import {
  extractPublicIdFromUrl,
  streamUpload,
} from "../../utils/cloudinary-destroy";
import cloudinary from "../../utils/cloudinary";

interface TemplateTheme {
  header?: {
    logoUrl?: {
      url?: string;
    };
    // other header properties if they exist
  };
  // other theme sections if they exist
}

const findAllUserTemplates = async (req: Request, res: Response) => {
  try {
    const userid = req.user.id;
  } catch (error) {
    serverError(error, res);
  }
};

const findUserSelectedTheme = async (req: Request, res: Response) => {
  try {
    const userid = req.user.id;
    const { themeId } = req.params;

    // Validate if templateId is provided
    if (!themeId) {
      res.status(400).json({
        message: "Please provide a template ID",
      });
      return;
    }

    // Find the template by its ID in the database
    const template = await TEMPLATE_MODEL.findById(themeId);

    // If the template is not found, return a 404 error
    if (!template) {
      res.status(404).json({
        message: "Template not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      template: template,
    });
  } catch (error) {
    serverError(error, res);
  }
};

const createNewTemplate = async (req: Request, res: Response) => {
  try {
    const { templateName, restaurantId } = req.body;
    const userId = req.user.id;

    if (!templateName) {
      res.status(400).json({ message: "Template name is required" });
      return;
    }

    // Check if the template exists in store
    const checkTemplateInStore = await STORE_TEMPLATES.findOne({
      name: templateName,
    });
    if (!checkTemplateInStore) {
      res.status(404).json({ message: "Template not found in store" });
      return;
    }

    // Get default structure for this template
    const defaultTemplateData =
      templateDefaults[templateName as keyof typeof templateDefaults];
    if (!defaultTemplateData) {
      res
        .status(400)
        .json({ message: "No default data found for this template" });
      return;
    }

    // Create a new template instance for the user
    const newTemplate = await TEMPLATE_MODEL.create({
      templateName: templateName,
      restaurantId,
      theme: defaultTemplateData,
    });

    res.status(201).json({
      success: true,
      message: "Template created successfully",
      templateId: newTemplate,
    });
  } catch (error) {
    serverError(error, res);
  }
};

const getAllUserOwnedTemplates = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const user = await USER_MODEL.findById(userId).select("purchasedTemplates");
    if (!user) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    res.status(200).json({
      // purchasedTemplates: user.purchasedTemplates,
    });
  } catch (error) {
    serverError(error, res);
  }
};

const updateTemplate = async (req: Request, res: Response) => {
  try {
    const { templateId } = req.params;
    const { theme } = req.body;

    if (!templateId) {
      res.status(400).json({ message: "Please provide a template ID" });
      return;
    }

    if (!theme) {
      res.status(400).json({ message: "Please provide a theme" });
      return;
    }

    const template = await TEMPLATE_MODEL.findById(templateId);
    if (!template) {
      res.status(404).json({ message: "Template not found" });
      return;
    }

    // Convert to plain JS object and deeply merge
    const currentTheme =
      template.theme instanceof Map
        ? Object.fromEntries(template.theme)
        : template.theme || {};
    const mergedTheme = merge({}, currentTheme, theme);

    template.set("theme", mergedTheme);
    await template.save();

    await template.save();

    res
      .status(200)
      .json({ message: "Template updated successfully", template });
  } catch (error) {
    serverError(error, res);
  }
};

const updateRestaurantLogo = async (req: Request, res: Response) => {
  try {
    const { templateId } = req.params;
    const userId = req.user.id;
    const logoFile = req.file;

    if (!templateId) {
      res.status(400).json({ message: "Please provide a template ID" });
      return;
    }

    if (!logoFile) {
      res.status(400).json({ message: "Please provide a logo file" });
      return;
    }

    const template = await TEMPLATE_MODEL.findById(templateId);
    if (!template) {
      res.status(404).json({ message: "Template not found" });
      return;
    }

    const currentTheme =
      template.theme instanceof Map
        ? Object.fromEntries(template.theme)
        : template.theme || {};

    // Check if the theme has a header section

    if (!currentTheme.header) {
      res
        .status(400)
        .json({ message: "Template does not have a header section with logo" });
      return;
    }

    // upload the logo file to cloudinary
    if (req.file) {
      const oldPublicId = extractPublicIdFromUrl(
        currentTheme.header.logoUrl.url
      );

      const isOriginalFolder =
        oldPublicId && oldPublicId.startsWith("templates/");

      if (oldPublicId && isOriginalFolder) {
        await cloudinary.uploader.destroy(oldPublicId);
      }

      const uploadResult = await streamUpload(req.file.buffer, "templates");

      if (currentTheme.header.logoUrl) {
        // theme.header.logoUrl.url = uploadResult.secure_url;
        currentTheme.header.logoUrl.url = uploadResult.secure_url;
      }

      const mergedTheme = merge({}, currentTheme, {
        header: {
          logoUrl: {
            url: uploadResult.secure_url,
          },
        },
      });
      template.set("theme", mergedTheme);
    }

    // Update the template with the new logo URL
    await template.save();

    res.status(200).json({
      message: "Logo updated successfully",
      template,
    });
  } catch (error) {
    serverError(error, res);
  }
};

export {
  findUserSelectedTheme,
  createNewTemplate,
  getAllUserOwnedTemplates,
  updateTemplate,
  updateRestaurantLogo,
};
