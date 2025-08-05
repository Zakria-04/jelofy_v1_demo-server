import { model, Schema } from "mongoose";

const SubscriptionPlanSchema = new Schema({
  // lang: {
  //   type: String,
  //   required: true,
  //   enum: ["en", "ar", "he", "es"],
  // },
  planName: {
    type: String,
    required: true,
  },
  nameId: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  priceId: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  features: [
    {
      type: String,
      required: true,
    },
  ],
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
});

const SUBSCRIPTION_PLAN_MODEL = model(
  "jelofy-subscription-plan",
  SubscriptionPlanSchema
);

export default SUBSCRIPTION_PLAN_MODEL;
