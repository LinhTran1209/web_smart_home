import mongoose from "mongoose";

const emailOtpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true },
    purpose: {
      type: String,
      enum: ["register", "forgot"],
      required: true,
      default: "register",
    },

    otpHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true, collection: "email_otps" }
);

emailOtpSchema.index({ email: 1, purpose: 1 }, { unique: true });

const EmailOtp = mongoose.model("EmailOtp", emailOtpSchema);
export default EmailOtp;
