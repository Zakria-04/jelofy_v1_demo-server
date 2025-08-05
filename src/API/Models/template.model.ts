// import { model, Schema } from "mongoose";

import mongoose, { model, Schema } from "mongoose";

// const template_schema = new Schema(
//   {
//     name: { type: String, required: true },
//     restaurantId: {
//       type: Schema.Types.ObjectId,
//       ref: "online-menu_restaurant",
//       required: true,
//     },

//     contact: {
//       name: { type: String },
//       phone: { type: String },
//       color: { type: String },
//       fontFamily: { type: String },
//       iconColor: { type: String },
//       disable: { type: Boolean, default: false },
//     },

//     // Logo Text Configuration
//     logoText: {
//       name: { type: String },
//       color: { type: String },
//       fontSize: { type: String },
//       fontFamily: { type: String },
//       disable: { type: Boolean, default: false },
//     },

//     // Logo URL Configuration
//     logoUrl: {
//       url: { type: String },
//       size: { type: String },
//       disable: { type: Boolean, default: false },
//     },

//     // Header Background Color
//     headerBgColor: { type: String },

//     // Background color of the menu
//     backgroundColor: { type: String },

//     // category section
//     category: {
//       categoryBgColorSelected: { type: String },

//       categoryTextColorSelected: {
//         color: { type: String },
//         fontFamily: { type: String },
//         disable: { type: Boolean, default: false },
//       },

//       borderSelected: {
//         size: { type: String },
//         color: { type: String },
//       },

//       border: {
//         size: { type: String },
//         color: { type: String },
//       },

//       categoryBgColor: { type: String },

//       categoryTextColor: {
//         color: { type: String },
//         fontFamily: { type: String },
//         disable: { type: Boolean, default: false },
//       },
//     },

//     // Contact section text style
//     contactTextColor: {
//       color: { type: String },
//       fontSize: { type: String },
//       fontFamily: { type: String },
//       disable: { type: Boolean, default: false },
//     },

//     // Contact URL configuration
//     contactUrl: {
//       url: { type: String },
//       color: { type: String },
//       disable: { type: Boolean, default: false },
//     },

//     // Meal Box Configuration
//     mealBox: {
//       // Background color of the meal box
//       backgroundColor: { type: String },

//       // Meal box description configuration (name, description, price, etc.)
//       mealBoxDescription: {
//         mealUrl: { type: String },
//         name: {
//           color: { type: String },
//           fontFamily: { type: String },
//         },
//         description: {
//           color: { type: String },
//           fontFamily: { type: String },
//           disable: { type: Boolean, default: false },
//         },
//         size: {
//           color: { type: String },
//           fontFamily: { type: String },
//           disable: { type: Boolean, default: false },
//         },
//         price: {
//           color: { type: String },
//           fontFamily: { type: String },
//           disable: { type: Boolean, default: false },
//         },
//         quantity: {
//           number: { type: Number },
//           color: { type: String },
//           fontSize: { type: String },
//           fontFamily: { type: String },
//         },
//         border: {
//           size: { type: String },
//           color: { type: String },
//           disable: { type: Boolean, default: false },
//         },
//       },
//     },

//     // product details
//     details: {
//       backgroundColor: { type: String },
//       name: {
//         color: { type: String },
//         fontFamily: { type: String },
//         disable: { type: Boolean, default: false },
//       },
//       description: {
//         color: { type: String },
//         fontFamily: { type: String },
//         disable: { type: Boolean, default: false },
//       },
//       price: {
//         color: { type: String },
//         fontFamily: { type: String },
//         disable: { type: Boolean, default: false },
//       },
//       // size
//       sizeText: {
//         color: { type: String },
//         fontFamily: { type: String },
//         disable: { type: Boolean, default: false },
//       },
//       sizeSelectedText: {
//         color: { type: String },
//         fontFamily: { type: String },
//         disable: { type: Boolean, default: false },
//       },
//       sizeBorder: {
//         size: { type: String },
//         color: { type: String },
//         disable: { type: Boolean, default: false },
//       },
//       sizeSelectedBorder: {
//         size: { type: String },
//         color: { type: String },
//         disable: { type: Boolean, default: false },
//       },
//       sizeBackground: { type: String },
//       sizeSelectedBackground: { type: String },

//       // footer
//       footerText: {
//         color: { type: String },
//         fontFamily: { type: String },
//         disable: { type: Boolean, default: false },
//       },
//       footerBorder: {
//         size: { type: String },
//         color: { type: String },
//         disable: { type: Boolean, default: false },
//       },
//       footerBackground: { type: String },
//       footerIcon: {
//         color: { type: String },
//         shape: { type: String },
//         disable: { type: Boolean, default: false },
//       },
//     },

//     // Footer Configuration
//     footer: {
//       backgroundColor: { type: String },
//       menuSection: {
//         url: { type: String },
//         color: { type: String },
//       },
//       menuSectionSelected: {
//         color: { type: String },
//       },
//       bookMark: {
//         url: { type: String },
//         color: { type: String },
//       },
//       bookMarkSelected: {
//         color: { type: String },
//       },
//     },
//   },
//   { timestamps: true }
// );

// const TEMPLATE_MODEL = model("online-menu_template", template_schema);

// export default TEMPLATE_MODEL;

const templateSchema = new Schema({

  templateName: { type: String, required: true },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "jelofy_restaurant",
  },
  theme: {
    type: Map,
    of: Schema.Types.Mixed, // the actual values like text, color, boolean, etc.
    default: {},
  },
}, { timestamps: true });

const TEMPLATE_MODEL = model("jelofy_template", templateSchema);
export default TEMPLATE_MODEL;
