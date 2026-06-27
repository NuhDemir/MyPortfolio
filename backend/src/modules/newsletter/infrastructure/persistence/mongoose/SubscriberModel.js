import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "E-posta adresi zorunludur"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Lütfen geçerli bir e-posta adresi girin",
      ],
    },
    status: {
      type: String,
      enum: ["pending", "subscribed", "unsubscribed"],
      default: "pending",
    },
    source: {
      type: String,
      default: "website",
    },
    ipAddress: {
      type: String,
    },
  },
  { timestamps: true }
);

export const SubscriberModel = mongoose.model("Subscriber", subscriberSchema);
export default SubscriberModel;
