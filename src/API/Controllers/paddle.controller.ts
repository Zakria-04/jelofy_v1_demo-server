// /server/controllers/paddleController.ts
import { Request, Response } from "express";
import USER_MODEL from "../Models/user.model";
import serverError from "../../utils/errorMessage";

const saveCheckoutId = async (req: Request, res: Response) => {
  try {
    const { checkoutId, planName } = req.body;
    const userId = req.user.id;
    console.log("planName:", planName);

    if (!checkoutId || !userId) {
      res.status(400).json({ message: "Checkout ID or user ID is missing." });
      return;
    }

    const user = await USER_MODEL.findByIdAndUpdate(
      userId,
      { subscriptionId: checkoutId, plan: planName },
      { new: true }
    );
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    console.log("✅ Checkout ID saved for user:", user.email);
    res.status(200).json({
      message: "Checkout ID saved successfully.",
      user: {
        email: user.email,
        checkoutId: user.subscriptionId,
      },
    });
  } catch (error) {
    serverError(error, res);
  }
};

// const handlePaddleWebhook = async (req: Request, res: Response) => {
//   try {
//     const event = req.body;

//     // console.log("✅ Received Paddle webhook:", event);

//     if (event.event_type === "transaction.completed") {
//       console.log(" Received payment completed Paddle webhook:", event);
//       const user = await USER_MODEL.findOne({ subscriptionId: event?.data?.id });

//       if (!user) {
//         res.status(404).send("User not found.");
//         return;
//       }

//       user.planStartDate = event?.billing_period?.start_at || new Date();
//       user.planEndDate =
//         event?.billing_period?.ends_at ||
//         new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

//       user.isPlanActive = true;
//       user.isSubscribed = true;

//       await user.save();
//       // console.log("✅ User plan updated:", user);
//     }

//     res.status(200).send("Webhook received.");
//   } catch (error) {
//     console.error("Webhook error:", error);
//     res.status(500).send("Internal server error.");
//   }
// };

const handlePaddleWebhook = async (req: Request, res: Response) => {
  try {
    const event = req.body;

    const eventType = event?.event_type;
    const eventData = event?.data;

    console.log(`🔔 Paddle webhook received: ${eventType}`);

    switch (eventType) {
      // 1. Payment completed (first payment or renewal)
      case "transaction.completed": {
        // const subscriptionId = eventData?.subscription_id;
        const subscriptionId = event?.data?.id;
        const user = await USER_MODEL.findOne({ subscriptionId });

        if (user) {
          user.planStartDate =
            eventData?.billing_period?.starts_at || new Date();
          user.planEndDate =
            eventData?.billing_period?.ends_at ||
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          user.isPlanActive = true;
          user.isSubscribed = true;
          await user.save();
          console.log(
            `✅ transaction.completed → Updated plan for user: ${user.email}`
          );
        }
        break;
      }

      // 2. Subscription created (e.g. after upgrade/downgrade)
      case "subscription.created": {
        const customerId = eventData?.customer_id;
        const subscriptionId = eventData?.id;
        const planDescription =
          eventData?.items?.[0]?.price?.description || "Unknown";

        const user = await USER_MODEL.findOne({ paddleCustomerId: customerId });

        if (user) {
          user.subscriptionId = subscriptionId;
          user.plan = planDescription;
          user.planStartDate = eventData?.billing_period?.starts_at;
          user.planEndDate = eventData?.billing_period?.ends_at;
          user.isPlanActive = true;
          user.isSubscribed = true;
          await user.save();
          console.log(
            `✅ subscription.created → New plan set for user: ${user.email}`
          );
        }
        break;
      }

      // 3. Subscription updated (e.g. scheduled cancellation or plan change)
      case "subscription.updated": {
        const subscriptionId = eventData?.id;
        const scheduledChange = eventData?.scheduled_change;

        const user = await USER_MODEL.findOne({ subscriptionId });
        if (user) {
          if (scheduledChange?.action === "cancel") {
            user.isCancelScheduled = true;
            user.cancelEffectiveDate = scheduledChange?.effective_at;
            await user.save();
            console.log(
              `🕒 subscription.updated → Cancel scheduled for user: ${user.email}`
            );
          }
        }
        break;
      }

      // 4. Subscription canceled (when the subscription actually ends)
      case "subscription.canceled": {
        const subscriptionId = eventData?.id;
        const user = await USER_MODEL.findOne({ subscriptionId });

        if (user) {
          user.isSubscribed = false;
          user.isPlanActive = false;
          user.plan = "starter"
          user.planEndDate = new Date();
          user.isCancelScheduled = false;
          user.cancelEffectiveDate = new Date(0);
          await user.save();
          console.log(
            `❌ subscription.canceled → Plan deactivated for user: ${user.email}`
          );
        }
        break;
      }

      default:
        console.log(`⚠️ Unhandled Paddle event: ${eventType}`);
    }

    res.status(200).send("Webhook processed.");
  } catch (error) {
    console.error("❌ Webhook error:", error);
    serverError(error, res);
  }
};

export { handlePaddleWebhook, saveCheckoutId };
