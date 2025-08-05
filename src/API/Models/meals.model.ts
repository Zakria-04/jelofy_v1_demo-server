// import { model, Schema } from "mongoose";

// const meal_schema = new Schema(
//   {
//     name: { type: String, required: true },
//     description: { type: String },
//     price: { type: Number },
//     imageUrl: { type: String },
//     category: { type: String, required: true },
//     restaurant: {
//       type: Schema.Types.ObjectId,
//       required: true,
//     },
//     size: [
//       {
//         size: { type: String },
//         price: { type: Number },
//         quantity: { type: Number, default: 0 },
//         stock: { type: Boolean, default: true },
//       },
//     ],
//     isAvailable: { type: Boolean, default: true },
//   },
//   { timestamps: true }
// );

// const MEAL_MODEL = model("online-menu_meal", meal_schema);
// export default MEAL_MODEL;

import { model, Schema } from "mongoose";

const meal_schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number },
    imageUrl: { type: String },
    category: { type: String, required: true },
    translations: {
      type: Map,
      of: new Schema({
        name: String,
        description: String,
        languageKey: String,
        // iconImgUrl: String,
        category: String,
        // isAutoTranslated: { type: Boolean, default: false }, //TODO this is for future use when we add auto translation
        // languageCode: String,
      }),
      default: {},
    },
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "jelofy_restaurant",
      required: true,
    },
    size: [
      {
        size: { type: String },
        price: { type: Number },
        // quantity: { type: Number, default: 0 }, //? quantity was added when a user bookmark the meal he can increase the quantity to see the updated price
        stock: { type: Boolean, default: true },
      },
    ],
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);
// meal_schema.index({ restaurant: 1, category: 1 });
const MEAL_MODEL = model("jelofy_meal", meal_schema);
export default MEAL_MODEL;
