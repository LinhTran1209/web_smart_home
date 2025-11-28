import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layouts/authLayout.jsx";
import InputForm from "../../components/forms/inputForm.jsx";

import ResetIllustration from "../../assets/images/img_auth/resetPass.svg";
import verifyIllustration from "../../assets/images/img_auth/verify.svg";
import ForgotIllustration from "../../assets/images/img_auth/forgot_pass.svg";

import iconEmail from "../../assets/icons/email.svg";
import iconPassword from "../../assets/icons/password.svg";
import iconPasswordplus from "../../assets/icons/password_plus.svg";

import { toast } from "sonner";
import api from "../../utils/axios.js";
import isValidEmail from "../../utils/isValidEmail.js";

const ForgotResetPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("email");

  // step 1
  const [email, setEmail] = useState("");

  // step 2
  const OTP_LENGTH = 6;
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const otpRefs = useRef([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCounting, setIsCounting] = useState(false);

  // step 3
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const formatTime = (sec) => {
    const mm = String(Math.floor(sec / 60)).padStart(2, "0");
    const ss = String(sec % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  // countdown
  useEffect(() => {
    if (step !== "otp" || !isCounting) return;
    if (timeLeft <= 0) {
      setIsCounting(false);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [step, isCounting, timeLeft]);

  // ===== step 1: send OTP =====
  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    const normalized = email.trim().toLowerCase();

    if (!normalized) {
      setErrors({ email: "Email is required." });
      toast.warning("Email is required.");
      return;
    }

    if (!isValidEmail(normalized)) {
      setErrors({ email: "Invalid email format." });
      toast.warning("Invalid email format.");
      return;
    }

    try {
      await api.post("/auth/send-otp", {
        email: normalized,
        purpose: "forgot",   // ✅ forgot flow
      });

      toast.success("OTP sent to your email.");
      setStep("otp");
      setOtp(Array(OTP_LENGTH).fill(""));
      setErrors({});
      setTimeLeft(180);
      setIsCounting(true);

      setTimeout(() => otpRefs.current[0]?.focus(), 0);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Failed to send OTP. Please try again.";
      toast.error(msg);
      setErrors({ email: msg });
    }
  };

  // ===== otp handlers =====
  const handleOtpChange = (index, value) => {
    const v = value.replace(/\D/g, "");
    const newOtp = [...otp];
    newOtp[index] = v ? v[0] : "";
    setOtp(newOtp);

    if (v && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // ===== verify OTP button =====
  const handleVerifyOtp = async () => {
    if (timeLeft <= 0) {
      toast.warning("OTP expired. Please resend.");
      return;
    }

    const code = otp.join("");
    if (code.length !== OTP_LENGTH) {
      toast.warning("Please enter the full 6-digit OTP.");
      return;
    }

    try {
      await api.post("/auth/verify-otp", {
        email,
        otp: code,
        purpose: "forgot", 
      });

      toast.success("OTP verified successfully.");
      setIsCounting(false);
      setStep("reset");
    } catch (err) {
      const msg = err?.response?.data?.message || "Invalid OTP.";
      toast.error(msg);
      setErrors({ otp: msg });
      setOtp(Array(OTP_LENGTH).fill(""));
      otpRefs.current[0]?.focus();
    }
  };

  const handleResendOtp = async () => {
    try {
      await api.post("/auth/send-otp", {
        email,
        purpose: "forgot",
      });

      toast.success("OTP resent.");
      setErrors({});
      setOtp(Array(OTP_LENGTH).fill(""));
      setTimeLeft(180);
      setIsCounting(true);
      otpRefs.current[0]?.focus();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to resend OTP.");
    }
  };

  // ===== reset password =====
  const handleResetChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    const { newPassword, confirmPassword } = formData;

    const newErr = {};
    if (!newPassword) newErr.newPassword = "New password is required.";
    else if (newPassword.length <= 3)
      newErr.newPassword = "Password must be longer than 3 characters.";

    if (!confirmPassword)
      newErr.confirmPassword = "Confirm password is required.";
    else if (confirmPassword !== newPassword)
      newErr.confirmPassword = "Passwords do not match.";

    if (Object.keys(newErr).length > 0) {
      setErrors(newErr);
      toast.warning("Please check your inputs.");
      return;
    }

    try {
      await api.post("/auth/reset-password", {
        email,
        newPassword,
      });

      toast.success("Password reset successfully.");
      navigate("/signin");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Reset password failed.");
    }
  };

  const illustrationSrc = useMemo(() => {
    if (step === "reset") return ResetIllustration;
    if (step === "otp") return verifyIllustration;
    return ForgotIllustration;
  }, [step]);

  return (
    <AuthLayout>
      <div className="auth-illustration fade-in-up">
        <img src={illustrationSrc} alt="auth illustration " />
      </div>

      <div className={`auth-form-wrapper step-${step}`}>
        {/* STEP 1 */}
        {step === "email" && (
          <form className="auth-form fade-in-up" onSubmit={handleVerifyEmail}>
            <h2 className="auth-title">RESET PASSWORD</h2>

            <InputForm
              type="email"
              name="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((p) => ({ ...p, email: "" }));
              }}
              required
              icon={<img src={iconEmail} alt="@" style={{ width: 20 }} />}
              // error={errors.email}
            />

            <div className="auth-submit-area">
              <button type="submit" className="auth-submit-btn">
                VERIFY EMAIL
              </button>
            </div>
          </form>
        )}

        {/* STEP 2 */}
        {step === "otp" && (
          <div className="auth-form otp-form slide-in-right">
            <h2 className="auth-title">VERIFY OTP</h2>

            <div className="otp-timer">{formatTime(timeLeft)}</div>

            <div className="otp-input-row">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el)}
                  className="otp-input"
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                />
              ))}
            </div>

            {errors.otp && <p className="otp-error">{errors.otp}</p>}

            <div style={{ width: "100%", display: "flex", gap: 10 }}>
              <button
                type="button"
                className="auth-submit-btn"
                style={{ flex: 1, borderRadius: 12 }}
                onClick={handleVerifyOtp}
              >
                VERIFY OTP
              </button>

              <button
                type="button"
                className="otp-resend-btn"
                style={{ width: 120, borderRadius: 12 }}
                onClick={handleResendOtp}
              >
                RESEND
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === "reset" && (
          <form className="auth-form slide-in-right" onSubmit={handleResetSubmit}>
            <h2 className="auth-title">RESET PASSWORD</h2>

            <InputForm
              type="email"
              name="email"
              label="Email"
              value={email}
              disabled
              icon={<img src={iconEmail} alt="@" style={{ width: 20 }} />}
            />

            <InputForm
              type="password"
              name="newPassword"
              label="New Password"
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={handleResetChange}
              required
              icon={<img src={iconPassword} alt="lock" style={{ width: 20 }} />}
              // error={errors.newPassword}
            />

            <InputForm
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleResetChange}
              required
              icon={<img src={iconPasswordplus} alt="lock" style={{ width: 20 }} />}
              error={errors.confirmPassword}
            />

            <div className="auth-links-row">
              <a href="/signin" className="auth-link">
                Back to Sign In
              </a>
            </div>

            <div className="auth-submit-area">
              <button type="submit" className="auth-submit-btn">
                RESET PASSWORD
              </button>
            </div>
          </form>
        )}
      </div>
    </AuthLayout>
  );
};

export default ForgotResetPassword;
