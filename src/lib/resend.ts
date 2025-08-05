import { Resend } from "resend";
import * as dotenv from "dotenv";
dotenv.config();
// Ensure you have the RESEND_API_KEY set in your environment variables
if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not defined in environment variables");
}

// <onboarding@resend.dev> //? used to test the resend service

const resend = new Resend(process.env.RESEND_API_KEY);

export default resend;
