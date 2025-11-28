import bcrypt from "bcrypt";
import EmailOtp from "../models/emailOtpModel.js";
import Account from "../models/accountsModel.js";
import { transporter } from "../utils/mailer.js";

const OTP_EXPIRE_SECONDS = 180;

// POST /api/auth/send-otp
// body: { email, purpose: "register" | "forgot" }
export const sendOtp = async (req, res) => {
  try {
    const { email, purpose = "register" } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required." });

    if (!["register", "forgot"].includes(purpose))
      return res.status(400).json({ message: "Invalid OTP purpose." });

    const normalizedEmail = email.trim().toLowerCase();

    const existed = await Account.findOne({ email: normalizedEmail });

    if (purpose === "register" && existed) {
      return res.status(400).json({ message: "Email already exists." });
    }
    if (purpose === "forgot" && !existed) {
      return res.status(404).json({ message: "Email not found." });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    console.log("OTP:", otp);

    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + OTP_EXPIRE_SECONDS * 1000);

    await EmailOtp.findOneAndUpdate(
      { email: normalizedEmail, purpose },
      { otpHash, expiresAt, verified: false },
      { upsert: true, new: true }
    );

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: normalizedEmail,
      subject:
        purpose === "register"
          ? "Your Register OTP Code"
          : "Your Reset Password OTP Code",
      html: `
        <h2>${
          purpose === "register"
            ? "Verify your email"
            : "Reset password verification"
        }</h2>
        <p>Your OTP code is:</p>
        <h1 style="letter-spacing:4px">${otp}</h1>
        <p>Code expires in 3 minutes.</p>
      `,
    });

    res.status(200).json({ message: "OTP sent." });
  } catch (err) {
    console.error("sendOtp error", err);
    res.status(500).json({ message: "Failed to send OTP." });
  }
};

// POST /api/auth/verify-otp
// body: { email, otp, purpose }
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp, purpose = "register" } = req.body;

    if (!email || !otp)
      return res.status(400).json({ message: "Email and OTP are required." });

    if (!["register", "forgot"].includes(purpose))
      return res.status(400).json({ message: "Invalid OTP purpose." });

    const normalizedEmail = email.trim().toLowerCase();

    const record = await EmailOtp.findOne({
      email: normalizedEmail,
      purpose,
    });

    if (!record) {
      return res.status(400).json({ message: "OTP not found. Please resend." });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired." });
    }

    const ok = await bcrypt.compare(String(otp), record.otpHash);
    if (!ok) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    record.verified = true;
    await record.save();

    res.status(200).json({ message: "OTP verified." });
  } catch (err) {
    console.error("verifyOtp error", err);
    res.status(500).json({ message: "Verify OTP failed." });
  }
};

// POST /api/auth/reset-password
// body: { email, newPassword }
export const resetPasswordByOtp = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email and new password are required." });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // forgot-password luôn check purpose="forgot"
    const record = await EmailOtp.findOne({
      email: normalizedEmail,
      purpose: "forgot",
    });

    if (!record || !record.verified) {
      return res.status(400).json({ message: "Email is not verified by OTP." });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired." });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    const updated = await Account.findOneAndUpdate(
      { email: normalizedEmail },
      { password: passwordHash },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Account not found." });
    }

    await EmailOtp.deleteOne({ email: normalizedEmail, purpose: "forgot" });

    res.status(200).json({ message: "Password reset successfully." });
  } catch (err) {
    console.error("resetPasswordByOtp error", err);
    res.status(500).json({ message: "Reset password failed." });
  }
};
