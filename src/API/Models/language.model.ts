import { model, Schema } from "mongoose";

const languageSchema = new Schema({
  lang: {
    type: String,
    enum: ["en", "ar", "he", "es"],
    default: "en",
    required: true,
  },
  translations: {
    type: Schema.Types.Mixed,
    default: {},
  },
});

const LANGUAGE_MODEL = model("jelofy_language", languageSchema);
export default LANGUAGE_MODEL;
