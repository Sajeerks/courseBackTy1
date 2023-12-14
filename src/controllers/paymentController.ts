import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import { userModel } from "../models/userModel";
import ErrorHandler from "../utils/ErrorHandler";
import { instance } from "../server";
import { paymentModel } from "../models/paymentModel";

// import Razorpay from "razorpay";

export const buySubscription = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userModel.findById(req.user._id);
    if (!user) return next(new ErrorHandler("please login to subscribe", 400));
    if (user.role === "admin")
      return next(new ErrorHandler("Admin cant buy subscrption", 404));

    //    var instance2 = new Razorpay({ key_id: process.env.RAZOR_PAY_KEY!, key_secret: process.env.RAZOR_PAY_SECRET! })

    const plan_id = process.env.RAZOR_PLAN_ID || "plan_N9QKLgSwv1yvyT";

    // console.log(instance2);

    const subscription = await instance.subscriptions.create({
      plan_id,
      customer_notify: 1,
      total_count: 12,
    });

    //  console.log(subscription);
    user.subscription.id = subscription.id;
    user.subscription.status = subscription.status;

    await user.save();

    res.status(201).json({
      success: true,
      subscriptionId: subscription.id,
      message: `subscription added successfully`,
    });
  }
);

export const paymentVerification = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userModel.findById(req.user._id);
    if (!user) return next(new ErrorHandler("please login to subscribe", 400));
 
    const { razorpay_payment_id, razorpay_order_id, razorpay_subscription_id } =
      req.body;
     console.log(req.body);
      console.log( razorpay_payment_id, razorpay_order_id, razorpay_subscription_id );
    const subscirption_id = user.subscription.id;
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZOR_PAY_SECRET!)
      .update(razorpay_payment_id + "|" + subscirption_id, "utf-8")
      .digest("hex");
    const isAuthenic = generated_signature === razorpay_subscription_id;

    if (!isAuthenic) {
      return res.redirect(`${process.env.FRONTEND_URL!}/paymentFailed`);
    }
    await paymentModel.create({
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_subscription_id,
    });
    user.subscription.status = "active";

    await user.save();

    res.redirect(
      `${process.env
        .FRONTEND_URL!}/paymentsuccess?reference=${razorpay_payment_id}`
    );
  }
);

export const getRazorPayKey = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      success: true,
      key: process.env.RAZOR_PAY_KEY,
    });
  }
);

export const cancelSubscription = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userModel.findById(req.user._id);
    if(!user) return next(new ErrorHandler("please login to cancel ", 404))

    const subscriptionId = user?.subscription.id?.toString()
    let refund = false;
    if (subscriptionId) {
      await instance.subscriptions.cancel(subscriptionId);
    }
    const payment = await paymentModel.findOne({
      razorpay_subscription_id: subscriptionId,
    });
    const gap = Date.now() - Number(payment?.createdAt);
    const refundTime = Number(process.env.REFUND_DAYS!) * 24 * 60 * 60 * 1000;

    if (refundTime > gap) {
      await instance.payments.refund(payment?.razorpay_payment_id!, {
        amount: "499",
        speed: "normal",
        notes: {
          notes_key_1: "Beam me up Scotty.",
          notes_key_2: "Engage",
        },
        receipt: "Receipt No. 31",
      });
      refund = true;
    }

    await paymentModel.findByIdAndDelete(subscriptionId)

    user.subscription.id = undefined
    user.subscription.status = undefined
await user.save()
    res.status(200).json({
      success: true,
      message: refund
        ? "subscription cancelled you will recieve full refund within 7 days"
        : "Subsription cancelled no refund will be intitated since you cancelled after 7 days",
    });
  }
);
