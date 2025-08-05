import { model, Schema } from "mongoose";

const subscribedSchema = new Schema({
  subscriberEmail: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
});

const SUBSCRIBER_MODEL = model("jelofy_subscriber", subscribedSchema);
export default SUBSCRIBER_MODEL;
