import mongoose, { model, Schema } from "mongoose";

const user_schema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: { type: String, unique: true, sparse: true }, // sparse to allow non true unique emails like null
    password: { type: String },
    authProvider: {
      type: String,
      enum: ["google", "email"],
      default: "email",
    },
    refreshTokens: [{ type: String, default: [] }],
    plan: {
      type: String,
      enum: ["starter", "business", "pro", "ultimate"],
      default: "starter", //? commented out to prevent the managers from having a plan
    },
    isPlanActive: { type: Boolean, default: false },
    subscriptionId: { type: String, unique: true, sparse: true },
    planStartDate: { type: Date },
    planEndDate: { type: Date },
    isCancelScheduled: { type: Boolean, default: false },
    cancelEffectiveDate: { type: Date, default: null },
    role: { type: String, enum: ["admin", "manager"], default: "admin" },
    managers: [{ type: String, unique: true, sparse: true, default: [] }], //? managers are stored as emails
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "jelofy_user",
      default: null,
    },
    isSubscribed: { type: Boolean, default: false },
    // restaurantId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "online-menu_restaurant",
    //   default: null,
    // },
    // purchasedTemplates: [{ type: String }],
  },
  { timestamps: true }
);

const USER_MODEL = model("jelofy_user", user_schema);
export default USER_MODEL;
