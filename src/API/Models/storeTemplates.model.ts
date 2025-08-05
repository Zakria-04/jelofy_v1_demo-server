import { model, Schema } from "mongoose";

const storeTemplates_Schema = new Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  category: {
    type: String,
  },

  popularity: {
    type: Number,
    default: 0,
  },

  features: [
    {
      type: String,
      required: true,
    },
  ],

  templateService: {
    type: String,
  },

  selectedByUsers: {
    type: Number,
    default: 0,
  },

  requiresSubscription: { type: Boolean, default: true },

  price: {
    type: Number,
  },

  imageURL: {
    type: String,
  },

  previewURL: {
    type: String,
  },

  isActive: {
    type: Boolean,
    default: true,
  },
});

const STORE_TEMPLATES = model("jelofy-store-template", storeTemplates_Schema);

export default STORE_TEMPLATES;
