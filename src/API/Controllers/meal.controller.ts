import { Request, Response } from "express";
import serverError from "../../utils/errorMessage";
import MEAL_MODEL from "../Models/meals.model";
import RESTAURANT_MODEL from "../Models/restaurant.model";
import TEMPLATE_MODEL from "../Models/template.model";
import cloudinary from "../../utils/cloudinary";
import { v4 as uuidv4 } from "uuid";
import USER_MODEL from "../Models/user.model";

const getAllUserMeals = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    // Find the restaurant owned by the user
    const restaurant = await RESTAURANT_MODEL.findOne({ owner: userId });

    if (!restaurant) {
      res.status(404).json({
        success: false,
        message: "No restaurant found for this user",
        type: "empty restaurant",
      });
      return;
    }

    // Fetch all meals associated with the user's restaurant
    const meals = await MEAL_MODEL.find({ restaurant: restaurant._id })
    // .sort({
    //   restaurant: 1,
    //   category: 1,
    // });

    res.status(200).json({ meals });
  } catch (error) {
    serverError(error, res);
  }
};

// interface Template {
//   _id: string;
//   details: {
//     name: string;
//     colorScheme: string;
//     // add other fields here
//   };
// }

// interface Restaurant {
//   _id: string;
//   businessUrl: string;
//   selectedTemplateId: Template | string;
// }

// const getMealById = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const meal = await MEAL_MODEL.findById(id).populate<{
//       restaurant: { selectedTemplateId: Template };
//     }>({
//       path: "restaurant",
//       select: "selectedTemplateId", // Only select the template ID
//       populate: {
//         path: "selectedTemplateId",
//       },
//     });

//     if (!meal) {
//       res.status(404).json({ message: "Meal not found" });
//       return;
//     }

//     if (!meal.restaurant) {
//       res.status(404).json({ message: "Restaurant not found" });
//       return;
//     }

//     if (!meal.restaurant.selectedTemplateId) {
//       res.status(404).json({ message: "Template not found" });
//       return;
//     }

//     // Create a new object that only includes the template
//     const response = {
//       meal: {
//         ...meal.toObject(),
//         restaurant: {
//           selectedTemplateId: meal.restaurant.selectedTemplateId,
//         },
//       },
//     };

//     res.status(200).json(response);
//   } catch (error) {
//     serverError(error, res);
//   }
// };

const getMealById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const meal = await MEAL_MODEL.findById(id);

    if (!meal) {
      res.status(404).json({ message: "Meal not found" });
      return;
    }

    const findRestaurant = await RESTAURANT_MODEL.findById(meal.restaurant);

    if (!findRestaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }

    const findTemplate = await TEMPLATE_MODEL.findById(
      findRestaurant.selectedTemplateId
    );

    if (!findTemplate) {
      res.status(404).json({ message: "Template not found" });
      return;
    }

    res.status(200).json({
      selectedTemplate: findRestaurant.selectedTemplate,
      selectedMeal: meal,
      // template: findTemplate.details,
    });
  } catch (error) {
    serverError(error, res);
  }
};

const streamUpload = (buffer: Buffer) => {
  return new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "meals",
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

const createNewMeal = async (req: Request, res: Response) => {
  try {
    const { name, description, price, category, restaurantId, active } =
      req.body;
    const userId = req.user.id;

    const size = JSON.parse(req.body.sizes);

    if (!name || !category || !restaurantId) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const restaurant = await RESTAURANT_MODEL.findOne({ owner: userId });

    if (!restaurant) {
      res.status(404).json({ message: "No restaurant found for this user" });
      return;
    }

    // give the starter plan user max 7 meals
    const user = await USER_MODEL.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const meal = await MEAL_MODEL.find({
      restaurant: restaurantId,
    });
    // const meal = await MEAL_MODEL.find({ restaurant: restaurantId })
    //   .sort({ category: 1, name: 1 }) // optional name sort for order within each category
    //   .lean();

    if (user.plan === "starter" && meal.length >= 7) {
      res.status(400).json({
        message:
          "You've reached the maximum of 7 meals on the free plan. 🚀 Upgrade to unlock unlimited meals and more premium features!",
      });
      return;
    }
    // if (!req.file) {
    //   res.status(400).json({ message: "Image file is required" });
    //   return;
    // }

    // const uploadResult = await streamUpload(req.file.buffer)

    let imageUrl = null;

    if (req.file) {
      const uploadResult = await streamUpload(req.file.buffer);
      imageUrl = uploadResult.secure_url;
    }

    const isActive = active === "true";

    const newMeal = new MEAL_MODEL({
      name,
      description,
      price,
      category,
      imageUrl,
      restaurant: restaurantId,
      isAvailable: isActive,
      size,
    });

    await newMeal.save();

    res.status(201).json({ success: true, meal: newMeal });
    return;
  } catch (error) {
    serverError(error, res);
  }
};

//! This is the original createNewMeal function that uses a callback for Cloudinary upload
//? i thought it was not working but eventually it was working and i wasn't using it correctly do not delete it yet
//TODO add multiple file upload to this function to make it faster for the user to add images
// const createNewMeal = async (req: Request, res: Response) => {
//   try {
//     const { name, description, price, category, restaurantId } = req.body;
//     const userId = req.user.id;

//     if (!name || !description || !price || !category || !restaurantId) {
//       res.status(400).json({ message: "All fields are required" });
//       return;
//     }

//     console.log("name", name);
//     console.log("description", description);

//     const restaurant = await RESTAURANT_MODEL.findOne({ owner: userId });

//     if (!restaurant) {
//       res.status(404).json({ message: "No restaurant found for this user" });
//       return;
//     }

//     let imageUrl = "";

//     if (req.file) {
//       const uploadResult = await cloudinary.uploader.upload_stream(
//         {
//           folder: "meals", // optional: organize uploads
//           public_id: uuidv4(), // unique filename
//         },
//         async (error, result) => {
//           if (error || !result) {
//             res
//               .status(500)
//               .json({ message: "Cloudinary upload failed", error });
//             return;
//           }

//           imageUrl = result.secure_url;

//           const newMeal = new MEAL_MODEL({
//             name,
//             description,
//             price,
//             category,
//             imageUrl, // store Cloudinary URL
//             restaurant: restaurantId,
//           });

//           await newMeal.save();
//           res.status(201).json({ meal: newMeal });
//           return;
//         }
//       );

//       // Use stream to push file buffer
//       uploadResult.end(req.file.buffer);
//     } else {
//       res.status(400).json({ message: "Image file is required" });
//       return;
//     }
//   } catch (error) {
//     serverError(error, res);
//   }
// };

const updateMeal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, active } = req.body;
    const userId = req.user.id;

    const size = JSON.parse(req.body.sizes);

    if (!id) {
      res.status(400).json({ message: "Please provide a meal ID" });
      return;
    }

    const meal = await MEAL_MODEL.findById(id);
    if (!meal) {
      res.status(404).json({ message: "Meal not found" });
      return;
    }

    // Authorization check: ensure the user owns the restaurant
    const restaurant = await RESTAURANT_MODEL.findOne({
      _id: meal.restaurant,
      owner: userId,
    });
    if (!restaurant) {
      res
        .status(403)
        .json({ message: "You are not authorized to update this meal" });
      return;
    }

    // Update fields if provided
    meal.name = name || meal.name;
    meal.description = description || meal.description;
    meal.price = price || meal.price;
    meal.category = category || meal.category;
    meal.size = size || meal.size;
    if (typeof active === "string") {
      meal.isAvailable = active === "true";
    }

    // Handle image replacement
    if (req.file) {
      // Delete old image from Cloudinary
      const oldPublicId = extractPublicIdFromUrl(meal.imageUrl!);
      // check if the imageUrl is from its original folder
      const isOriginalFolder = oldPublicId && oldPublicId.startsWith("meals/");

      if (oldPublicId && isOriginalFolder) {
        await cloudinary.uploader.destroy(oldPublicId);
      }

      // Upload new image
      const uploadResult = await streamUpload(req.file.buffer);
      meal.imageUrl = uploadResult.secure_url;
    }

    await meal.save();

    res.status(200).json({
      success: true,
      message: "Meal updated successfully",
      updatedMeal: meal,
    });
  } catch (error) {
    serverError(error, res);
  }
};

// Helper to extract public_id from Cloudinary image URL
function extractPublicIdFromUrl(imageUrl: string): string | null {
  try {
    const parts = imageUrl.split("/upload/");
    if (parts.length < 2) return null;

    // Remove the version (e.g., "v1746601109") and extension
    const pathSegments = parts[1].split("/");
    pathSegments.shift(); // remove version
    const publicIdWithExt = pathSegments.join("/");
    const publicId = publicIdWithExt.split(".")[0];

    return publicId;
  } catch (error) {
    return null;
  }
}

const deleteMeal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!id) {
      res.status(400).json({ message: "Meal ID is required" });
      return;
    }

    const meal = await MEAL_MODEL.findById(id);
    if (!meal) {
      res.status(404).json({ message: "Meal not found" });
      return;
    }

    const restaurant = await RESTAURANT_MODEL.findOne({
      _id: meal.restaurant,
      owner: userId,
    });
    if (!restaurant) {
      res.status(403).json({ message: "Not authorized to delete this meal" });
      return;
    }

    // Delete image from Cloudinary
    const publicId = extractPublicIdFromUrl(meal.imageUrl!);

    // check if the imageUrl is from its original folder
    const isOriginalFolder = publicId && publicId.startsWith("meals/");
    if (publicId && isOriginalFolder) {
      await cloudinary.uploader.destroy(publicId);
    }

    // Delete meal from database
    await MEAL_MODEL.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Meal deleted successfully",
      mealId: id,
    });
  } catch (error) {
    serverError(error, res);
  }
};

// const deleteMeal = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user.id;

//     if (!id) {
//       res.status(400).json({ message: "Meal ID is required" });
//       return;
//     }

//     const meal = await MEAL_MODEL.findById(id);
//     if (!meal) {
//       res.status(404).json({ message: "Meal not found" });
//       return;
//     }

//     const restaurant = await RESTAURANT_MODEL.findOne({
//       _id: meal.restaurant,
//       owner: userId,
//     });
//     if (!restaurant) {
//       res.status(403).json({ message: "Not authorized to delete this meal" });
//       return;
//     }

//     // Extract translation language keys from the deleted meal
//     const deletedMealLangKeys = meal.translations
//       ? Array.from(meal.translations.keys())
//       : [];

//     // Delete image from Cloudinary
//     const publicId = extractPublicIdFromUrl(meal.imageUrl!);
//     if (publicId) {
//       await cloudinary.uploader.destroy(publicId);
//     }

//     // Delete the meal
//     await MEAL_MODEL.findByIdAndDelete(id);

//     // Get all remaining meals for this restaurant
//     const remainingMeals = await MEAL_MODEL.find({
//       restaurant: restaurant._id,
//     });

//     // Build a set of all translation keys still used in other meals
//     const usedLangKeys = new Set<string>();
//     for (const m of remainingMeals) {
//       if (m.translations) {
//         for (const key of m.translations.keys()) {
//           usedLangKeys.add(key);
//         }
//       }
//     }

//     // Filter restaurant languages that are still used
//     const updatedLanguages = restaurant.languages.filter((langObj) =>
//       usedLangKeys.has(langObj.lang)
//     );

//     if (updatedLanguages.length !== restaurant.languages.length) {
//       // restaurant.languages = updatedLanguages;
//       restaurant.set("languages", updatedLanguages);
//       await restaurant.save();
//     }

//     res
//       .status(200)
//       .json({ success: true, message: "Meal deleted successfully" });
//   } catch (error) {
//     serverError(error, res);
//   }
// };

const getAllUserRestaurantMeals = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const { restaurantId } = req.params;
    if (!restaurantId) {
      res.status(400).json({ message: "Restaurant ID is required" });
      return;
    }

    //Find the restaurant meals based on the restaurantId
    const meals = await MEAL_MODEL.find({ restaurant: restaurantId });

    //check if meals exist
    if (!meals) {
      res.status(404).json({
        success: false,
        message: "No meals found for this restaurant",
        type: "empty meals",
      });
      return;
    }

    //check if the restaurant belongs to the user because why not
    const restaurant = await RESTAURANT_MODEL.findOne({
      _id: restaurantId,
      owner: userId,
    });

    if (!restaurant) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to view this restaurant's meals",
        type: "not authorized",
      });
      return;
    }

    res.status(200).json({ meals });
  } catch (error) {
    serverError(error, res);
  }
};

const updateMealTranslation = async (req: Request, res: Response) => {
  const { mealId } = req.params;
  const { lang, dir, translation } = req.body;

  // Basic validation
  if (!lang || typeof lang !== "string") {
    res.status(400).json({ error: "Language key (lang) is required." });
    return;
  }

  if (!translation || typeof translation !== "object") {
    res.status(400).json({ error: "Translation object is required." });
    return;
  }

  const { name, description, category } = translation;

  try {
    const meal = await MEAL_MODEL.findById(mealId);
    if (!meal) {
      res.status(404).json({ error: "Meal not found." });
      return;
    }

    // Set or update the translation
    meal.translations.set(lang, { name, description, category });

    await meal.save();

    // add the lang to the restaurant languages if it doesn't exist
    // const restaurant = await RESTAURANT_MODEL.findById(meal.restaurant);
    // if (!restaurant) {
    //   res.status(404).json({ error: "Restaurant not found." });
    //   return;
    // }
    // const existingLang = restaurant.languages.find(
    //   (language) => language.lang === lang
    // );

    // if (!existingLang) {
    //   restaurant.languages.push({ lang, dir }); // default direction
    //   await restaurant.save();
    // }

    res.status(200).json({ success: true, meal });
    return;
  } catch (err) {
    serverError(err, res);
  }
};

export {
  getAllUserMeals,
  getMealById,
  createNewMeal,
  updateMeal,
  deleteMeal,
  getAllUserRestaurantMeals,
  updateMealTranslation,
};
