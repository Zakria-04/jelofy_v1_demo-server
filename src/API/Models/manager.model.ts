import { model, Schema } from "mongoose";

const managerSchema = new Schema({
  userName: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: "jelofy_restaurant",
    default: null,
  },
  role: { type: String, enum: ["manager"], default: "manager" },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: "jelofy_user",
    default: null,
  },
});

const Manager_MODEL = model("jelofy_manager", managerSchema);
export default Manager_MODEL;
