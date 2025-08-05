import { Request, Response } from "express";
import serverError from "../../utils/errorMessage";
import RESTAURANT_MODEL from "../Models/restaurant.model";
import MEAL_MODEL from "../Models/meals.model";
import TEMPLATE_MODEL from "../Models/template.model";
import { generateAndUploadQR } from "../../utils/generateQrCode";
import USER_MODEL from "../Models/user.model";
import { templateDefaults } from "../../utils/templateDefaults";
import STORE_TEMPLATES from "../Models/storeTemplates.model";
import { v2 as cloudinary } from "cloudinary";
import {
  generateUniqueRestaurantUrl,
  sanitizeBusinessUrl,
} from "../../utils/sanitizeBusinessUrl";
import { v4 as uuidv4 } from "uuid";
import { ObjectId } from "mongoose";
import { extractPublicIdFromUrl } from "../../utils/cloudinary-destroy";

/**
 * Controller to find a restaurant by its business URL and fetch its meals.
 */
const findRestaurantByURL = async (req: Request, res: Response) => {
  try {
    // Extract businessUrl from request parameters (e.g., /store/cafina)
    const { businessUrl } = req.params;

    // Validate if businessUrl is provided
    if (!businessUrl) {
      res.status(400).json({
        message: "Please provide a business URL",
      });
      return;
    }

    // Find the restaurant by its business URL in the database
    const restaurant = await RESTAURANT_MODEL.findOne({ businessUrl });

    // If the restaurant is not found, return a 404 error
    if (!restaurant) {
      res.status(404).json({
        message: "Restaurant not found",
      });
      return;
    }

    // Check if the restaurant is active
    // if (!restaurant.isActive) {
    //   res.status(400).json({
    //     message: "Restaurant is not active", //TODO
    //   });
    //   return;
    // }

    // Find the template associated with the restaurant
    const template = await TEMPLATE_MODEL.findById(
      restaurant.selectedTemplateId
    );

    // If the template is not found, return a 404 error
    if (!template) {
      res.status(404).json({
        message: "Template not found",
      });
      return;
    }

    // Retrieve all meals associated with the found restaurant
    const getRestaurantMeals = await MEAL_MODEL.find({
      restaurant: restaurant._id,
    })
    // .sort({ category: 1 });

    // Respond with restaurant details and its meals
    res.status(200).json({
      selectedTemplate: restaurant.selectedTemplate,
      businessUrl: restaurant.businessUrl,
      template: template.theme,
      meals: getRestaurantMeals,
      restaurantId: restaurant._id,
      restaurantLanguages: restaurant.languages,
      isActive: restaurant.isActive,
      templateId: restaurant.selectedTemplateId,
      restaurantName: restaurant.restaurantName,
      currency: restaurant.currency,
    });
  } catch (error) {
    serverError(error, res);
  }
};

/**
 * Controller to find all restaurants owned by a user.
 */
// This function retrieves all restaurants associated with the authenticated user.
const findUserRestaurants = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    // Validate if userId is provided
    if (!userId) {
      res.status(400).json({
        message: "User ID is required",
      });
      return;
    }

    const findRestaurants = await RESTAURANT_MODEL.find({ owner: userId }).sort(
      {
        createdAt: 1,
      }
    );
    res.status(200).json({
      success: true,
      restaurants: findRestaurants,
    });
  } catch (error) {
    serverError(error, res);
  }
};

const createNewRestaurant = async (req: Request, res: Response) => {
  try {
    const { restaurantName, templateId } = req.body;

    const userId = req.user.id;

    if (!userId) {
      res.status(400).json({
        message: "User ID is required",
      });
      return;
    }

    // check if user subscription is active and alow him to create a restaurant
    const user = await USER_MODEL.findById(userId);
    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    let restaurantLimit = 0;

    if (user.plan === "starter") {
      restaurantLimit = 1;
    } else if (user.plan === "business") {
      restaurantLimit = 3;
    } else if (user.plan === "pro") {
      restaurantLimit = 5;
    } else if (user.plan === "ultimate") {
      restaurantLimit = Infinity;
    }

    // Check if the user has reached their restaurant limit

    const userRestaurants = await RESTAURANT_MODEL.find({ owner: userId });
    if (userRestaurants.length >= restaurantLimit) {
      res.status(400).json({
        message: `You have reached your restaurant limit of ${restaurantLimit}.`,
      });
      return;
    }

    //TODO check if the plan is active when creating a restaurant
    // if (!restaurantName) {
    //   res.status(400).json({ message: "Missing required fields." });
    //   return;
    // }

    const businessUrl = `my-restaurant-${Math.floor(
      1000 + Math.random() * 9000 // generate 4 digit random number
    )}`; //? when the project grows you can add more digits otherwise don't touch it

    // get template model
    // const template = await STORE_TEMPLATES.findById(templateId);
    // if (!template) {
    //   res.status(404).json({ message: "Template not found" });
    //   return;
    // }

    // Get default structure for this template
    // const defaultTemplateData =
    //   templateDefaults[template.name as keyof typeof templateDefaults];
    // if (!defaultTemplateData) {
    //   res
    //     .status(400)
    //     .json({ message: "No default data found for this template" });
    //   return;
    // }

    // create a new template
    // const createNewTemplate = await TEMPLATE_MODEL.create({
    //   templateName: template.name,
    //   restaurantId, //TODO add the restaurant id here
    //   theme: defaultTemplateData,
    // });

    // Create the restaurant
    const newRestaurant = await RESTAURANT_MODEL.create({
      restaurantName: restaurantName || "My Restaurant",
      businessUrl,
      owner: userId,
      // selectedTemplateId: createNewTemplate._id,
    });

    // Generate & upload QR code
    const qrUrl = await generateAndUploadQR(
      newRestaurant.businessUrl,
      newRestaurant._id.toString()
    );

    // Save QR code URL to the restaurant
    newRestaurant.qrCodeUrl = qrUrl;
    await newRestaurant.save();

    // Respond
    res.status(201).json({
      message: "Restaurant created successfully",
      restaurant: newRestaurant,
    });
  } catch (error) {
    serverError(error, res);
  }
};

const createRestaurantAndTemplate = async (req: Request, res: Response) => {
  try {
    const { restaurantName, templateId, restaurantUrl } = req.body;

    // Validate required fields
    // if (!restaurantName) {
    //   res.status(400).json({ message: "Restaurant name is required" });
    //   return;
    // }

    if (!templateId) {
      res.status(400).json({ message: "Template ID is required" });
      return;
    }

    const userId = req.user.id;

    if (!userId) {
      res.status(400).json({
        message: "User ID is required",
      });
      return;
    }

    // check if user subscription is active and alow him to create a restaurant
    const user = await USER_MODEL.findById(userId);
    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    const templateStore = await STORE_TEMPLATES.findOne({ name: templateId });
    if (!templateStore) {
      res.status(404).json({
        message: "Template not found",
      });
      return;
    }

    if (templateStore.requiresSubscription && user.plan === "starter") {
      res.status(400).json({
        message: "Premium Template Locked",
      });
      return;
    }

    let restaurantLimit = 0;

    if (user.plan === "starter") {
      restaurantLimit = 1;
    } else if (user.plan === "business") {
      restaurantLimit = 1;
    } else if (user.plan === "pro") {
      restaurantLimit = 3;
    } else if (user.plan === "ultimate") {
      restaurantLimit = Infinity;
    }

    // Check if the user has reached their restaurant limit

    const userRestaurants = await RESTAURANT_MODEL.find({ owner: userId });
    if (userRestaurants.length >= restaurantLimit) {
      res.status(400).json({
        message: `You have reached your restaurant limit of ${restaurantLimit} Restaurants.`,
      });
      return;
    }

    const businessUrl = `my-restaurant-${Math.floor(
      1000 + Math.random() * 9000 // generate 4 digit random number
    )}`; //? when the project grows you can add more digits otherwise don't touch it

    // Get default structure for this template
    const defaultTemplateData =
      templateDefaults[templateStore.name as keyof typeof templateDefaults];
    if (!defaultTemplateData) {
      res
        .status(400)
        .json({ message: "No default data found for this template" });
      return;
    }

    const createNewTemplate = await TEMPLATE_MODEL.create({
      templateName: templateStore.name,
      theme: defaultTemplateData,
    });

    // Create the restaurant
    const newRestaurant = await RESTAURANT_MODEL.create({
      restaurantName: restaurantName || "My Restaurant",
      // businessUrl: sanitizeBusinessUrl(restaurantUrl),
      businessUrl: await generateUniqueRestaurantUrl(restaurantUrl),
      owner: userId,
      languages: [{ lang: "default", isDefault: true, dir: "ltr" }],
      selectedTemplateId: createNewTemplate._id,
    });

    // Update the template with the restaurant ID
    createNewTemplate.restaurantId = newRestaurant._id;
    await createNewTemplate.save();

    // Generate & upload QR code
    const qrUrl = await generateAndUploadQR(
      newRestaurant.businessUrl,
      newRestaurant._id.toString()
    );

    // Save QR code URL to the restaurant
    newRestaurant.qrCodeUrl = qrUrl;
    await newRestaurant.save();

    // Respond
    res.status(201).json({
      success: true,
      message: "Restaurant & Template created successfully",
      restaurant: newRestaurant,
      // template: createNewTemplate.theme,
    });
  } catch (error) {
    serverError(error, res);
  }
};

const createRestaurantAndTemplateForGoogle = async ({
  userId,
  templateName,
  restaurantName,
}: {
  userId: ObjectId;
  templateName: string;
  restaurantName?: string;
}) => {
  try {
    // Validate required fields
    if (!userId) {
      throw new Error("User ID is required");
    }

    if (!templateName) {
      throw new Error("Template name is required");
    }

    // Check user existence
    const user = await USER_MODEL.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Generate unique business URL
    const businessUrl = `my-restaurant-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    // Get template data
    const template = await STORE_TEMPLATES.findOne({ name: templateName });
    if (!template) {
      throw new Error("Template not found");
    }

    // Get default template structure
    const defaultTemplateData =
      templateDefaults[template.name as keyof typeof templateDefaults];
    if (!defaultTemplateData) {
      throw new Error("No default data found for this template");
    }

    // Create the restaurant
    const newRestaurant = await RESTAURANT_MODEL.create({
      restaurantName: restaurantName || "My Restaurant",
      businessUrl,
      owner: userId,
      languages: [{ lang: "default", isDefault: true, dir: "ltr" }],
      selectedTemplateId: null, // Will be updated after template creation
    });

    // Create the template with reference to the restaurant
    const newTemplate = await TEMPLATE_MODEL.create({
      templateName: template.name,
      restaurantId: newRestaurant._id,
      theme: defaultTemplateData,
    });

    // Update restaurant with the created template ID
    newRestaurant.selectedTemplateId = newTemplate._id as any;
    await newRestaurant.save();

    // Generate & upload QR code
    newRestaurant.qrCodeUrl = await generateAndUploadQR(
      businessUrl,
      newRestaurant._id.toString()
    );

    await newRestaurant.save();

    return { restaurant: newRestaurant, template: newTemplate };
  } catch (error) {
    console.error("Error creating restaurant and template:", error);
    throw error;
  }
};

// const createNewRestaurant = async (req: Request, res: Response) => {
//   try {
//     const { restaurantName, templateId } = req.body;
//     const userId = req.user?.id;

//     // Validate required fields
//     if (!userId) {
//       res.status(400).json({ message: "User ID is required" });
//       return;
//     }

//     if (!restaurantName) {
//       res.status(400).json({ message: "Restaurant name is required" });
//       return;
//     }

//     if (!templateId) {
//       res.status(400).json({ message: "Template ID is required" });
//       return;
//     }

//     // Check user existence and subscription
//     const user = await USER_MODEL.findById(userId);
//     if (!user) {
//       res.status(404).json({ message: "User not found" });
//       return;
//     }

//     // Define restaurant limits based on plan
//     const planLimits: Record<string, number> = {
//       starter: 1,
//       business: 3,
//       pro: 5,
//       ultimate: Infinity,
//     };

//     const restaurantLimit = planLimits[user.plan] || 0;

//     // Check restaurant limit
//     const userRestaurants = await RESTAURANT_MODEL.find({ owner: userId });
//     if (userRestaurants.length >= restaurantLimit) {
//       res.status(400).json({
//         message: `You have reached your restaurant limit of ${restaurantLimit}.`,
//       });
//       return;
//     }

//     // Generate unique business URL
//     const businessUrl = `my-restaurant-${Math.floor(
//       1000 + Math.random() * 9000
//     )}`;

//     // Get template data
//     const template = await STORE_TEMPLATES.findById(templateId);
//     if (!template) {
//       res.status(404).json({ message: "Template not found" });
//       return;
//     }

//     // Get default template structure
//     const defaultTemplateData =
//       templateDefaults[template.name as keyof typeof templateDefaults];
//     if (!defaultTemplateData) {
//       res.status(400).json({
//         message: "No default data found for this template",
//       });
//       return;
//     }

//     // Create the restaurant first
//     const newRestaurant = await RESTAURANT_MODEL.create({
//       restaurantName,
//       businessUrl,
//       owner: userId,
//       // selectedTemplateId will be updated after template creation
//     });

//     // Create template with reference to the restaurant
//     const newTemplate = await TEMPLATE_MODEL.create({
//       templateName: template.name,
//       restaurantId: newRestaurant._id,
//       theme: defaultTemplateData,
//     });

//     // Update restaurant with template reference
//     // newRestaurant.selectedTemplateId = newTemplate._id as any

//     // Generate & upload QR code
//     newRestaurant.qrCodeUrl = await generateAndUploadQR(
//       businessUrl,
//       newRestaurant._id.toString()
//     );

//     await newRestaurant.save();

//     res.status(201).json({
//       message: "Restaurant created successfully",
//       restaurant: newRestaurant,
//     });
//   } catch (error) {
//     serverError(error, res);
//   }
// };

const toggleRestaurantActiveStatus = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;

    // Validate if restaurantId is provided
    if (!restaurantId) {
      res.status(400).json({
        message: "Restaurant ID is required",
      });
      return;
    }

    // Find the restaurant by its ID in the database
    const restaurant = await RESTAURANT_MODEL.findById(restaurantId);

    // If the restaurant is not found, return a 404 error
    if (!restaurant) {
      res.status(404).json({
        message: "Restaurant not found",
      });
      return;
    }

    // Toggle the active status of the restaurant
    restaurant.isActive = !restaurant.isActive;
    await restaurant.save();

    // Respond with the updated restaurant details
    res.status(200).json({
      success: true,
      message: "Restaurant status updated successfully",
      isActive: restaurant.isActive,
    });
  } catch (error) {
    serverError(error, res);
  }
};

// controllers/restaurantController.ts

//? this function might be removed
const updateRestaurantLanguages = async (req: Request, res: Response) => {
  const { restaurantId } = req.params;
  const { languages, defaultLang } = req.body;

  if (!Array.isArray(languages) || languages.length === 0) {
    res.status(400).json({ error: "Languages array is required." });
    return;
  }

  // Validate language objects
  for (const langObj of languages) {
    if (
      !langObj.lang ||
      typeof langObj.lang !== "string" ||
      !["ltr", "rtl"].includes(langObj.dir)
    ) {
      res.status(400).json({
        error:
          'Each language must include a valid "lang" and "dir" ("ltr" or "rtl").',
      });
      return;
    }
  }

  try {
    const restaurant = await RESTAURANT_MODEL.findById(restaurantId);
    if (!restaurant) {
      res.status(404).json({ error: "Restaurant not found." });
      return;
    }

    restaurant.languages.splice(0, restaurant.languages.length);

    for (const lang of languages) {
      restaurant.languages.push(lang);
    }

    if (defaultLang) {
      const exists = languages.some((l) => l.lang === defaultLang);
      if (!exists) {
        res
          .status(400)
          .json({ error: "defaultLang must exist in the languages array." });
        return;
      }
      restaurant.defaultLang = defaultLang;
    }

    await restaurant.save();
    res.status(200).json({ success: true, restaurant });
    return;
  } catch (err) {
    serverError(err, res);
  }
};

const addOrUpdateRestaurantLanguages = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;
    const { lang, dir } = req.body;
    const userId = req.user.id;
    const restaurant = await RESTAURANT_MODEL.findById(restaurantId);
    if (!restaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }

    const user = await USER_MODEL.findById(userId);
    if (user?.plan === "starter") {
      res.status(400).json({
        message:
          "Multi-language support is not included in the Starter plan. Upgrade to unlock this feature.",
      });
      return;
    }
    // Check if the language already exists
    const existingLang = restaurant.languages.find(
      (language) => language.lang === lang
    );
    if (existingLang) {
      // Update the existing language
      existingLang.dir = dir;
    } else {
      // Add a new language
      restaurant.languages.push({ lang, dir });
    }
    // Save the updated restaurant
    await restaurant.save();
    res.status(200).json({
      success: true,
      message: "Language added/updated successfully",
      restaurant,
      updatedRestaurant: {
        languages: restaurant.languages, // only include the field you want to update in Redux
      },
    });
  } catch (error) {
    serverError(error, res);
  }
};

const updateRestaurantDetails = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;
    const { restaurantName, businessUrl } = req.body;

    if (!restaurantId) {
      res.status(400).json({ message: "Restaurant ID is required" });
      return;
    }

    if (!restaurantName && !businessUrl) {
      res.status(400).json({
        message: "At least one of restaurantName or businessUrl is required",
      });
      return;
    }

    const restaurant = await RESTAURANT_MODEL.findById(restaurantId);

    if (!restaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }

    const isUrlChanged = businessUrl && businessUrl !== restaurant.businessUrl;

    // Update name if provided
    if (restaurantName) {
      restaurant.restaurantName = restaurantName;
    }

    // If business URL is changed, regenerate QR code
    if (isUrlChanged) {
      const publicId = extractPublicIdFromUrl(restaurant.businessUrl);

      const isOriginalFolder = publicId && publicId.startsWith("qr_codes/");
      if (restaurant.businessUrl && isOriginalFolder) {
        await cloudinary.uploader.destroy(publicId);
      }

      const cloudinaryPublicId = `${restaurant._id}`;

      // Generate and upload new QR
      const newQrUrl = await generateAndUploadQR(
        businessUrl,
        cloudinaryPublicId
      );

      restaurant.qrCodeUrl = newQrUrl;
      restaurant.businessUrl = `qr_codes/${cloudinaryPublicId}`;
      restaurant.businessUrl = businessUrl;
    }

    await restaurant.save();

    res.status(200).json({
      success: true,
      message: "Restaurant details updated successfully",
      restaurant,
    });
    return;
  } catch (error) {
    serverError(error, res);
  }
};

const deleteRestaurantLanguage = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;
    const { lang } = req.body;

    if (!restaurantId || !lang) {
      res
        .status(400)
        .json({ message: "Restaurant ID and language are required" });
      return;
    }

    const restaurant = await RESTAURANT_MODEL.findById(restaurantId);

    if (!restaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }

    restaurant.languages.pull({ lang });

    await restaurant.save();

    // delete the language from meals
    await MEAL_MODEL.updateMany(
      { restaurant: restaurantId },
      { $pull: { languages: { lang } } }
    );

    // delete the selected language translations
    await MEAL_MODEL.updateMany(
      { restaurant: restaurantId },
      { $unset: { [`translations.${lang}`]: "" } }
    );

    res.status(200).json({
      success: true,
      message: "Language deleted successfully",
      restaurant,
    });
  } catch (error) {
    serverError(error, res);
  }
};

const deleteUserRestaurant = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;

    if (!restaurantId) {
      res.status(400).json({ message: "Restaurant ID is required" });
      return;
    }

    const restaurant = await RESTAURANT_MODEL.findById(restaurantId);

    if (!restaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }

    // delete the restaurant's QR code from Cloudinary
    if (restaurant.qrCodeUrl) {
      const publicId = extractPublicIdFromUrl(restaurant.qrCodeUrl);

      const isOriginalFolder = publicId && publicId.startsWith("qr_codes/");

      // const publicId = restaurant.qrCodeUrl.split("/").pop()?.split(".")[0];
      if (isOriginalFolder && publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    // delete the restaurant's meals in cloudinary
    const meals = await MEAL_MODEL.find({ restaurant: restaurantId });
    for (const meal of meals) {
      if (meal.imageUrl) {
        const publicId = extractPublicIdFromUrl(meal.imageUrl);
        const isOriginalFolder = publicId && publicId.startsWith("meals/");
        if (isOriginalFolder && publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }
    }

    const template = await TEMPLATE_MODEL.findById(
      restaurant.selectedTemplateId
    );

    if (!template) {
      res.status(404).json({ message: "Template not found" });
      return;
    }

    // delete the restaurant's template logo in cloudinary
    const currentTheme =
      template.theme instanceof Map
        ? Object.fromEntries(template.theme)
        : template.theme || {};

    if (currentTheme.header?.logoUrl?.url) {
      const publicId = extractPublicIdFromUrl(currentTheme.header.logoUrl.url);
      const isOriginalFolder = publicId && publicId.startsWith("templates/");
      if (isOriginalFolder && publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    // delete the restaurant languages icons in cloudinary
    if (restaurant.languages) {
      for (const language of restaurant.languages) {
        if (language.iconUrl) {
          const publicId = extractPublicIdFromUrl(language.iconUrl);
          const isOriginalFolder =
            publicId && publicId.startsWith("languages_icons/");
          if (isOriginalFolder && publicId) {
            await cloudinary.uploader.destroy(publicId);
          }
        }
      }
    }

    // Delete the restaurant
    await RESTAURANT_MODEL.deleteOne({ _id: restaurantId });

    // Optionally, delete associated meals and templates
    await MEAL_MODEL.deleteMany({ restaurant: restaurantId });
    await TEMPLATE_MODEL.deleteMany({ restaurantId });

    res.status(200).json({
      success: true,
      message: "Restaurant deleted successfully",
      restaurantId,
    });
  } catch (error) {
    serverError(error, res);
  }
};

// const deleteRestaurantLanguage = async (req: Request, res: Response) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { restaurantId, lang } = req.params;

//     // Validate inputs
//     if (!restaurantId || !lang) {
//       await session.abortTransaction();
//       return res.status(400).json({
//         message: "Restaurant ID and language are required",
//       });
//     }

//     // Check if restaurant exists
//     const restaurant = await RESTAURANT_MODEL.findById(restaurantId).session(
//       session
//     );
//     if (!restaurant) {
//       await session.abortTransaction();
//       return res.status(404).json({ message: "Restaurant not found" });
//     }

//     // Check if language exists in restaurant
//     const langExists = restaurant.languages.some((l) => l.lang === lang);
//     if (!langExists) {
//       await session.abortTransaction();
//       return res
//         .status(404)
//         .json({ message: "Language not found in restaurant" });
//     }

//     // Remove language from restaurant
//     restaurant.languages = restaurant.languages.filter((l) => l.lang !== lang);
//     await restaurant.save({ session });

//     // Remove translations in this language from all meals
//     await MEAL_MODEL.updateMany(
//       { restaurant: restaurantId },
//       { $unset: { [`translations.${lang}`]: 1 } },
//       { session }
//     );

//     await session.commitTransaction();
//     session.endSession();

//     res.status(200).json({
//       success: true,
//       message: "Language and all related translations deleted successfully",
//       restaurant,
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     serverError(error, res);
//   }
// };

// check in real time if the business url exists
const checkIfBusinessUrlExists = async (req: Request, res: Response) => {
  try {
    const { businessUrl } = req.query;

    // Validate if businessUrl is provided
    if (!businessUrl) {
      res.status(400).json({
        message: "Business URL is required",
      });
      return;
    }

    // Check if the business URL already exists in the database
    const restaurant = await RESTAURANT_MODEL.findOne({ businessUrl });

    // Respond with the existence status
    res.status(200).json({
      exists: !!restaurant,
      message: restaurant
        ? "Business URL already exists"
        : "Business URL is available",
    });
  } catch (error) {
    serverError(error, res);
  }
};

const streamUpload = (buffer: Buffer) => {
  return new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "languages_icons",
        public_id: uuidv4(),
      },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    stream.end(buffer);
  });
};

const updateRestaurantSelectedLanguage = async (
  req: Request,
  res: Response
) => {
  try {
    const { restaurantId } = req.params;
    const { lang, dir, langId } = req.body;
    const iconFile = req.file;

    if (!restaurantId) {
      res.status(400).json({ message: "Restaurant ID is required" });
      return;
    }
    // if (!lang || !dir) {
    //   res.status(400).json({ message: "Language and direction are required" });
    //   return;
    // }
    if (!langId) {
      res.status(400).json({ message: "Language ID is required" });
      return;
    }
    const restaurant = await RESTAURANT_MODEL.findById(restaurantId);
    if (!restaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }

    // Check if the language already exists
    const existingLang = restaurant.languages.find(
      (language) => language._id.toString() === langId
    );

    if (!existingLang) {
      res.status(404).json({ message: "Language not found" });
      return;
    }
    // Update the existing language
    existingLang.lang = lang || existingLang.lang;
    existingLang.dir = dir || existingLang.dir;

    if (iconFile) {
      //check if there is an existing icon URL and delete it from Cloudinary

      // check if the imageUrl is from its original folder
      const isOriginalFolder =
        existingLang.iconUrl?.includes("languages_icons");
      if (existingLang.iconUrl && isOriginalFolder) {
        const publicId = existingLang.iconUrl.split("/").pop()?.split(".")[0];
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }

      // Upload the icon to Cloudinary
      const iconUploadResult = await streamUpload(iconFile.buffer);
      // existingLang.iconUrl = iconUploadResult.secure_url;

      existingLang.iconUrl = iconUploadResult.secure_url;
    }

    // Save the updated restaurant
    await restaurant.save();
    res.status(200).json({
      success: true,
      message: "Language updated successfully",
      restaurant,
    });
  } catch (error) {
    serverError(error, res);
  }
};

const addOrUpdateRestaurantCurrency = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;
    const { currency } = req.body;

    if (!restaurantId) {
      res.status(400).json({ message: "Restaurant ID is required" });
      return;
    }

    if (!currency) {
      res.status(400).json({ message: "Currency is required" });
      return;
    }

    const restaurant = await RESTAURANT_MODEL.findById(restaurantId);
    if (!restaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }

    // Update or add the currency
    restaurant.currency = currency;

    // Save the updated restaurant
    const updatedRestaurant = await restaurant.save();

    res.status(200).json({
      success: true,
      message: "Currency updated successfully",
      restaurant: updatedRestaurant,
      restaurantId: updatedRestaurant._id,
      currency: updatedRestaurant.currency,
    });
  } catch (error) {
    serverError(error, res);
  }
};

export {
  findRestaurantByURL,
  findUserRestaurants,
  createNewRestaurant,
  createRestaurantAndTemplate,
  toggleRestaurantActiveStatus,
  updateRestaurantLanguages,
  updateRestaurantDetails,
  addOrUpdateRestaurantLanguages,
  deleteRestaurantLanguage,
  deleteUserRestaurant,
  checkIfBusinessUrlExists,
  updateRestaurantSelectedLanguage,
  createRestaurantAndTemplateForGoogle,
  addOrUpdateRestaurantCurrency,
};
