import { model, Schema, Types } from "mongoose";

const restaurant_schema = new Schema(
  {
    restaurantName: { type: String },
    businessUrl: { type: String, unique: true, required: true },
    qrCodeUrl: { type: String },
    languages: [
      {
        lang: { type: String, required: true },
        dir: { type: String, enum: ["ltr", "rtl"], default: "ltr" },
        isDefault: { type: Boolean, default: false },
        iconUrl: {
          type: String,
          default:
            "https://res.cloudinary.com/dvvm7u4dh/image/upload/v1749454280/language_1_ezpzly.png",
        },
      },
    ],
    defaultLang: { type: String, default: "default" },
    location: { type: String },
    currency: { type: String, },
    owner: { type: String, required: true },
    managers: [{ type: String }],
    selectedTemplate: { type: String, default: "SimpleBites" },
    selectedTemplateId: { type: Types.ObjectId, ref: "jelofy_template" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

restaurant_schema.index({ businessUrl: 1, owner: 1 });

const RESTAURANT_MODEL = model("jelofy_restaurant", restaurant_schema);
export default RESTAURANT_MODEL;
