// // pages/api/send-support-email.ts

import resend from "../../lib/resend";
import { Request, Response } from "express";
import serverError from "../../utils/errorMessage";
import { Resend } from "resend";
import * as dotenv from "dotenv";
import USER_MODEL from "../Models/user.model";
dotenv.config();

// import { Resend } from "resend";

// import { Request, Response } from "express";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export default async function handler(req: Request, res: Response) {
//   if (req.method !== "POST") return res.status(405).end();

//   const { name, email, message } = req.body;

//   try {
//     const data = await resend.emails.send({
//       from: "Contact Form <support@yourdomain.com>",
//       to: "zakriaabdelgny04@gmail.com",
//       subject: "New Support Request",
//       html: `
//         <strong>Name:</strong> ${name}<br/>
//         <strong>Email:</strong> ${email}<br/>
//         <strong>Message:</strong><br/>${message}
//       `,
//     });

//     return res.status(200).json({ success: true });
//   } catch (err) {
//     return res.status(500).json({ error: "Failed to send email" });
//   }
// }

// const sendSupportEmail = async (req: Request, res: Response) => {
//   const { name, email, message, subject } = req.body;

//   try {
//     const resend = new Resend(process.env.RESEND_API_KEY);

//     resend.emails.send({
//       from: "Jelofy Support <jelofyteam@send.jelofy.com>", // This Support email make it work until getting verbified
//       to: "zakriaabdelgny04@gmail.com",
//       subject: subject || "New Support Request",
//       html: `
//   <div style="font-family: Arial, sans-serif; line-height: 1.6;">
//     <p>Hi <strong>${name}</strong>,</p>
//     <p>Thank you for reaching out! We've received your message and will get back to you as soon as possible.</p>

//     <p><strong>Your message:</strong></p>
//     <blockquote style="border-left: 4px solid #ccc; margin: 0; padding-left: 1em;">
//       ${message}
//     </blockquote>

//     <p>We’ll be in touch at: <strong>${email}</strong></p>

//     <p>Best regards,<br/>The Support Team</p>
//   </div>
// `,
//     });
//     res.status(200).json({ success: true });
//   } catch (error) {
//     serverError(error, res);
//   }
// };

const sendSupportEmail = async (req: Request, res: Response) => {
  const { name, email, message, subject } = req.body;

  try {
    const result = await resend.emails.send({
      from: "Jelofy Support <jelofyteam@send.jelofy.com>",
      to: "zakriaabdelgny04@gmail.com",
      subject: subject || "New Support Request",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <p>Hi <strong>${name}</strong>,</p>
          <p>Thank you for reaching out! We've received your message and will get back to you as soon as possible.</p>

          <p><strong>Your message:</strong></p>
          <blockquote style="border-left: 4px solid #ccc; margin: 0; padding-left: 1em;">
            ${message}
          </blockquote>

          <p>We’ll be in touch at: <strong>${email}</strong></p>

          <p>Best regards,<br/>The Support Team</p>
        </div>
      `,
    });

    console.log("Resend email result:", result);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Resend error:", error);
    res.status(500).json({ success: false, error: "Email failed" });
  }
};

const sendEmailToSubscribeUsers = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    // check if user is already subscribed
    const user = await USER_MODEL.findOne({ email });
    if (user?.isSubscribed) {
      return res.status(400).json({ error: "User is already subscribed." });
    }
    // send email to user
  } catch (error) {
    serverError(error, res);
  }
};

export { sendSupportEmail };
