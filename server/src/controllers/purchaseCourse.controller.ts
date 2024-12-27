import Stripe from "stripe";
import { AuthRequest } from "../middlewares/auth";
import { Response } from "express";
import { Course } from "../models/course.model";
import { PurchaseCourse } from "../models/purchaseCourse.model";
import { User } from "../models/user.model";
import { Lecture } from "../models/lecture.model";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const createCheckoutSession = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req._id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found!" });
    }

    const newPurchase = await PurchaseCourse.create({
      courseId: courseId,
      userId: userId,
      amount: course.price,
      status: "pending",
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: course.title,
              images: [course.thumbnail],
            },
            unit_amount: Math.round(course.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_BASE_URL}/course-progress/${courseId}`,
      cancel_url: `${process.env.CLIENT_BASE_URL}/course-detail/${courseId}`,
      metadata: {
        courseId: courseId,
        userId: userId,
      },
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "IN"],
      },
    } as Stripe.Checkout.SessionCreateParams);

    if (!session.url) {
      return res.status(500).json({
        success: false,
        message: "Failed to create checkout session",
      });
    }

    newPurchase.paymentId = session.id;
    await newPurchase.save();

    res.status(200).json({ success: true, url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const stripeWebhook = async (req: AuthRequest, res: Response) => {
  let event;

  try {
    const payloadString = JSON.stringify(req.body, null, 2);
    const secret = process.env.WEBHOOK_ENDPOINT_SECRET!;

    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret,
    });

    event = stripe.webhooks.constructEvent(payloadString, header, secret);
  } catch (error: any) {
    console.error("Webhook error:", error.message);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    console.log("check session complete is called");

    try {
      const session = event.data.object;

      const purchase = await PurchaseCourse.findOne({
        paymentId: session.id,
      }).populate({ path: "courseId", select: "lectures" });

      if (!purchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }

      // Use type assertion to safely access lectures
      const course = purchase.courseId as unknown as { lectures: string[] };

      if (!course.lectures || course.lectures.length === 0) {
        return res.status(404).json({ message: "Course lectures not found" });
      }

      if (session.amount_total) {
        purchase.amount = session.amount_total / 100;
      }
      purchase.status = "success";

      // Update lectures to make them visible
      await Lecture.updateMany(
        { _id: { $in: course.lectures } },
        { $set: { isPreview: true } }
      );

      await purchase.save();

      // Update user's enrolledCourses
      await User.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { enrolledCourses: purchase.courseId._id } }, // Add course ID to enrolledCourses
        { new: true }
      );

      // Update course to add user ID to enrolledStudents
      await Course.findByIdAndUpdate(
        purchase.courseId._id,
        { $addToSet: { enrolledStudents: purchase.userId } }, // Add user ID to enrolledStudents
        { new: true }
      );
    } catch (error) {
      console.error("Error handling event:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  res.status(200).send();
};

export const getCourseDetailWithPurchaseStatus = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { courseId } = req.params;
    const userId = req._id;

    const course = await Course.findById(courseId)
      .populate({ path: "creator" })
      .populate({ path: "lectures" });

    const purchased = await PurchaseCourse.findOne({ userId, courseId });

    if (!course) {
      return res.status(404).json({ message: "course not found!" });
    }

    return res.status(200).json({
      success: true,
      course,
      purchased: !!purchased, // true if purchased, false otherwise
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllPurchasedCourse = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const purchasedCourse = await PurchaseCourse.find({
      status: "completed",
    }).populate("courseId");
    if (!purchasedCourse) {
      return res.status(404).json({
        purchasedCourse: [],
      });
    }
    return res.status(200).json({
      purchasedCourse,
    });
  } catch (error) {
    console.log(error);
  }
};
