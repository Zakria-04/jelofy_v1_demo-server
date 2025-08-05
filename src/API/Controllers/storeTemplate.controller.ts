import { Request, Response } from "express";
import serverError from "../../utils/errorMessage";
import STORE_TEMPLATES from "../Models/storeTemplates.model";
import USER_MODEL from "../Models/user.model";
import RESTAURANT_MODEL from "../Models/restaurant.model";
import TEMPLATE_MODEL from "../Models/template.model";
import cloudinary from "../../utils/cloudinary";
import { extractPublicIdFromUrl } from "../../utils/cloudinary-destroy";
import { templateDefaults } from "../../utils/templateDefaults";

const getAllStoreTemplates = async (req: Request, res: Response) => {
  try {
    const storeTemplates = await STORE_TEMPLATES.find();
    res.status(200).json({ storeTemplates });
  } catch (error) {
    serverError(error, res);
  }
};

const createNewStoreTemplate = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      price,
      imageURL,
      previewURL,
      popularity,
      category,
      features,
      templateService,
      isActive,
    } = req.body;

    // Validate required fields
    if (!name) {
      res.status(400).json({ message: "Please provide all required fields" });
      return;
    }

    const newTemplate = new STORE_TEMPLATES({
      name,
      description,
      category,
      popularity,
      price,
      templateService,
      features,
      imageURL,
      previewURL,
      isActive,
    });

    await newTemplate.save();

    res
      .status(201)
      .json({ message: "Store template created successfully", newTemplate });
  } catch (error) {
    serverError(error, res);
  }
};

//? This function allows a user to purchase a template. now it is not used will be deleted later in the new version update
const purchaseTemplate = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { templateId } = req.params;

    // Validate if templateId is provided
    if (!templateId) {
      res.status(400).json({
        message: "Please provide a template ID",
      });
      return;
    }

    const template = await STORE_TEMPLATES.findById(templateId);

    // If the template is not found, return a 404 error
    if (!template) {
      res.status(404).json({
        message: "Template not found",
      });
      return;
    }

    // user model
    const user = await USER_MODEL.findById(userId);

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    // check if user has subscription plan
    if (template.requiresSubscription && user.plan === "starter") {
      res.status(400).json({
        message: "You need to upgrade your plan to purchase this template",
      });
      return;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Template purchased successfully",
      // purchasedTemplates: user.purchasedTemplates,
    });
  } catch (error) {
    serverError(error, res);
  }
};

const useTemplateToRestaurant = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { templateName, restaurantId } = req.body;
    // Validate required fields
    if (!templateName || !restaurantId) {
      res.status(400).json({ message: "Please provide all required fields" });
      return;
    }
    // Find the user
    const user = await USER_MODEL.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const restaurant = await RESTAURANT_MODEL.findById(restaurantId);
    if (!restaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }

    // check if user already using this template
    const template = await STORE_TEMPLATES.findOne({
      name: restaurant.selectedTemplate,
    });
    if (!template) {
      res.status(404).json({ message: "Template not found" });
      return;
    }

    const templateExists = await STORE_TEMPLATES.findOne({
      name: templateName,
    });
    if (!templateExists) {
      res.status(404).json({ message: "Template not found in store" });
      return;
    }

    if (templateExists.requiresSubscription && user.plan === "starter") {
      res.status(400).json({
        message: "Premium Template Locked",
      });
      return;
    }

    // check if template is active
    if (!templateExists.isActive) {
      res.status(400).json({
        title: "Template Under Construction 🚧",
        message:
          "This template is currently being perfected to give you the best experience.Hang tight — it will be available to use very soon!",
      });
      return;
    }

    if (restaurant.selectedTemplate === templateName) {
      res.status(400).json({
        message: "This restaurant is already using this template",
      });
      return;
    }

    // delete the old template data along with the data the images that has been saved in cloudinary

    const oldTemplate = await TEMPLATE_MODEL.findById(
      restaurant.selectedTemplateId
    );

    if (!oldTemplate) {
      res.status(404).json({ message: "Old template not found" });
      return;
    }

    const currentTheme =
      oldTemplate.theme instanceof Map
        ? Object.fromEntries(oldTemplate.theme)
        : oldTemplate.theme || {};

    // images from cloudinary
    const oldPublicId = extractPublicIdFromUrl(currentTheme.header.logoUrl.url);

    const isOriginalFolder =
      oldPublicId && oldPublicId.startsWith("templates/");

    if (oldPublicId && isOriginalFolder) {
      await cloudinary.uploader.destroy(oldPublicId);
    }

    // delete the old template data
    await TEMPLATE_MODEL.findByIdAndDelete(restaurant.selectedTemplateId);

    // Get default structure for this template
    const defaultTemplateData =
      templateDefaults["SimpleBites" as keyof typeof templateDefaults];
    if (!defaultTemplateData) {
      res
        .status(400)
        .json({ message: "No default data found for this template" });
      return;
    }

    // Create a new template for the restaurant
    const newTemplate = new TEMPLATE_MODEL({
      templateName,
      restaurantId: restaurant._id,
      theme: defaultTemplateData,
    });

    // Save the new template
    await newTemplate.save();

    // Update the restaurant with the new template
    restaurant.selectedTemplate = templateName;
    restaurant.selectedTemplateId = newTemplate._id as any;

    await restaurant.save();

    res.status(200).json({
      success: true,
      message: "Template applied to restaurant successfully",
      template: newTemplate,
    });
  } catch (error) {
    serverError(error, res);
  }
};

export {
  getAllStoreTemplates,
  createNewStoreTemplate,
  purchaseTemplate,
  useTemplateToRestaurant,
};
