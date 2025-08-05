import slugify from "slugify";
import RESTAURANT_MODEL from "../API/Models/restaurant.model";

export async function generateUniqueRestaurantUrl(baseInput?: string): Promise<string> {
  const baseSlug = slugify(
    typeof baseInput === "string" && baseInput.trim() !== ""
      ? baseInput
      : `my-restaurant-${Math.floor(1000 + Math.random() * 9000)}`,
    { lower: true, strict: true, trim: true }
  );

  let uniqueSlug = baseSlug;
  let counter = 1;

  while (await RESTAURANT_MODEL.findOne({ businessUrl: uniqueSlug })) {
    uniqueSlug = `${baseSlug}-${counter++}`;
  }

  return uniqueSlug;
}

const businessUrl = `my-restaurant-${Math.floor(
  1000 + Math.random() * 9000 // generate 4 digit random number
)}`; //? when the project grows you can add more digits otherwise don't touch it

export function sanitizeBusinessUrl(input?: string): string {
  const safeInput =
    typeof input === "string" && input.trim() !== "" ? input : businessUrl;

  const slug = slugify(safeInput, {
    lower: true,
    strict: true,
    trim: true,
  });

  return slug || businessUrl;
}
