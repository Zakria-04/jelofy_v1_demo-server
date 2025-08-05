import { model, Schema } from "mongoose";

//! this was the old schema that was used to store the template UI config
// const templateUiConfig = new Schema(
//   {
//     _ui: {
//       type: Map,
//       of: new Schema({
//         inputType: { type: String, required: true },
//         groupKey: { type: String },
//         labelKey: { type: String },
//         defaultValue: { type: Schema.Types.Mixed }, // to accept any type of value (string, number, boolean, etc.)
//       }),
//     },
//   },
//   { timestamps: true }
// );

// const templateUiConfig = new Schema(
//   {
//     templateName: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     _ui: {
//       type: [
//         new Schema({
//           key: { type: String, required: true },
//           inputType: { type: String, required: true },
//           groupKey: { type: String },
//           labelKey: { type: String },
//           path: { type: String },
//           defaultValue: { type: Schema.Types.Mixed },
//         }),
//       ],
//     },
//   },
//   { timestamps: true }
// );

const configItemSchema = new Schema(
  {
    key: { type: String, required: true },
    inputType: { type: String, required: true },
    groupKey: { type: String },
    labelKey: { type: String },
    description: { type: String },
    path: { type: String },
    defaultValue: { type: Schema.Types.Mixed },
  },
  { _id: false } // Prevents auto-generating _id for each config item
);

const templateUiConfig = new Schema(
  {
    templateName: {
      type: String,
      required: true,
      unique: true,
    },
    _ui: {
      type: Map,
      of: [configItemSchema], // Each key (like "header") maps to an array of config items
    },
  },
  { timestamps: true }
);

const TEMPLATE_UI_CONFIG = model("jelofy_templateUiConfig", templateUiConfig);
export default TEMPLATE_UI_CONFIG;
