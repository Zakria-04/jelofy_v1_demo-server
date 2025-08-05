import resend from "../../lib/resend";
import serverError from "../../utils/errorMessage";
import SUBSCRIBER_MODEL from "../Models/subscriber.model";
import { Request, Response } from "express";

const createSubscriber = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    // Validate the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      res.status(400).json({ message: "Invalid email format." });
      return;
    }
    // Check if the email is already subscribed
    const existingSubscriber = await SUBSCRIBER_MODEL.findOne({
      subscriberEmail: email,
    });
    if (existingSubscriber) {
      res.status(400).json({ message: "Email is already subscribed." });
      return;
    }
    // Create a new subscriber
    const newSubscriber = new SUBSCRIBER_MODEL({ subscriberEmail: email });
    await newSubscriber.save();

    // send email to the new subscriber
    await resend.emails.send({
      from: "Jelofy <jelofyteam@send.jelofy.com>",
      to: email,
      subject: "🎁 You're In! Get Ready for Exclusive Coupons",
      html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2>Thanks for subscribing!</h2>
      <p>You're officially on our list — and that means you'll be the first to know about new offers, updates, and exclusive deals.</p>
      <p><strong>We'll be sending special discount coupons straight to this email — so don’t miss out!</strong></p>
      <p>Stay tuned and enjoy the perks of being part of our community.</p>
      <br />
      <p>Talk soon,<br/>The Team</p>
    </div>
  `,
    });

    res
      .status(201)
      .json({ success: true, message: "Subscriber created successfully." });
  } catch (error) {
    serverError(error, res);
  }
};

export { createSubscriber };
