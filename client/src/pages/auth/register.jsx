import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layouts/authLayout.jsx";
import InputForm from "../../components/forms/inputForm.jsx";
import RegisterIllustration from "../../assets/images/img_auth/signin.svg";

import { UserCircle } from "lucide-react";
import iconEmail from "../../assets/icons/email.svg";
import iconPassword from "../../assets/icons/password.svg";
import iconPasswordplus from "../../assets/icons/password_plus.svg";

import { toast } from "sonner";
import api from "../../utils/axios.js";
import isValidEmail from "../../utils/isValidEmail.js";


const RegisterPage = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // ===== OTP state =====
  const OTP_LEN = 6;
  const [otp, setOtp] = useState(Array(OTP_LEN).fill(""));
  const otpRefs = useRef([]);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [timeLeft, setTimeLeft] = useState(0);
  const [isCounting, setIsCounting] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await api.get("/accounts");
      setAccounts(res.data || []);
    } catch (error) {
      toast.error("Failed to load accounts list.");
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // nếu user sửa email thì reset OTP
    if (name === "email") {
      setOtpSent(false);
      setOtpVerified(false);
      setOtp(Array(OTP_LEN).fill(""));
      setTimeLeft(0);
      setIsCounting(false);
    }
  };

  const isDuplicateEmail = (email) => {
    const normalized = email.trim().toLowerCase();
    return accounts.some(
      (acc) => (acc.email || "").trim().toLowerCase() === normalized
    );
  };

  const canSendOtp = useMemo(() => {
    const email = formData.email;
    return email.trim() && isValidEmail(email) && !isDuplicateEmail(email);
  }, [formData.email, accounts]);

  // ===== SEND OTP =====
  const handleSendOtp = async () => {
    const email = formData.email;

    if (!email.trim()) return toast.warning("Email is required.");
    if (!isValidEmail(email)) return toast.warning("Invalid email format.");
    if (isDuplicateEmail(email)) return toast.error("Email already exists.");

    try {
      await api.post("/auth/send-otp", { email, purpose: "register" });

      toast.success("OTP has been sent to your email.");
      setOtpSent(true);
      setOtpVerified(false);
      setOtp(Array(OTP_LEN).fill(""));

      setTimeLeft(180);
      setIsCounting(true);

      setTimeout(() => otpRefs.current[0]?.focus(), 0);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send OTP.");
    }
  };

  // ===== countdown 3 minutes =====
  useEffect(() => {
    if (!otpSent || !isCounting) return;
    if (timeLeft <= 0) {
      setIsCounting(false);
      return;
    }

    const t = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [otpSent, isCounting, timeLeft]);

  const formatTime = (sec) => {
    const mm = String(Math.floor(sec / 60)).padStart(2, "0");
    const ss = String(sec % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  // ===== OTP input handlers =====
  const handleOtpChange = (i, val) => {
    const v = val.replace(/\D/g, "");
    const newOtp = [...otp];
    newOtp[i] = v ? v[0] : "";
    setOtp(newOtp);

    if (v && i < OTP_LEN - 1) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      otpRefs.current[i - 1]?.focus();
    }
  };

  // ===== VERIFY OTP =====
  const handleVerifyOtp = async () => {
    const code = otp.join("");

    if (code.length !== OTP_LEN) {
      return toast.warning("Please enter the full 6-digit OTP.");
    }

    try {
      await api.post("/auth/verify-otp", {
        email: formData.email,
        otp: code,
        purpose: "register",
      });

      toast.success("Email verified successfully!");
      setOtpVerified(true);
      setIsCounting(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid OTP.");
      setOtp(Array(OTP_LEN).fill(""));
      otpRefs.current[0]?.focus();
    }
  };

  // ===== REGISTER =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fullName, email, password, confirmPassword } = formData;
    let warning = "";

    if (!fullName.trim()) warning = "Full name is required.";
    else if (!email.trim()) warning = "Email is required.";
    else if (!isValidEmail(email)) warning = "Invalid email format.";
    else if (isDuplicateEmail(email)) warning = "Email already exists.";
    else if (!password) warning = "Password is required.";
    else if (password.length <= 3)
      warning = "Password must be longer than 3 characters.";
    else if (!confirmPassword) warning = "Confirm password is required.";
    else if (confirmPassword !== password) warning = "Passwords do not match.";
    else if (!otpVerified)
      warning = "Please verify your email with OTP before registering.";

    if (warning) {
      toast.warning(warning);
      return;
    }

    try {
      await api.post("/auth/register", formData);
      toast.success("Registered successfully!");
      setTimeout(() => navigate("/signin"), 600);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Register failed.");
    }
  };

  return (
    <AuthLayout>
      {/* left */}
      <div className="auth-illustration fade-in-up">
        <img src={RegisterIllustration} alt="Register illustration" />
      </div>

      {/* right */}
      <form className="auth-form fade-in-up" onSubmit={handleSubmit}>
        <h2 className="auth-title">REGISTER</h2>

        <InputForm
          type="text"
          name="fullName"
          label="Full Name"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={handleChange}
          required
          icon={<UserCircle size={20} />}
        />

        <InputForm
          type="email"
          name="email"
          label="Email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
          required
          icon={<img src={iconEmail} alt="@" style={{ width: 20 }} />}
        />

        <InputForm
          type="password"
          name="password"
          label="Password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          required
          icon={<img src={iconPassword} alt="lock" style={{ width: 20 }} />}
        />

        <InputForm
          type="password"
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          icon={<img src={iconPasswordplus} alt="lock" style={{ width: 20 }} />}
        />

        {/* ===== OTP BLOCK AT BOTTOM ===== */}
        <div className="otp-card fade">
          <div className="otp-card-header">
            <span className="otp-card-title">Email Verification</span>
            {otpSent && !otpVerified && (
              <span className="otp-timer">{formatTime(timeLeft)}</span>
            )}
            {otpVerified && (
              <span className="otp-verified-badge">Verified</span>
            )}
          </div>

          {!otpSent && (
            <button
              type="button"
              className="otp-send-btn"
              onClick={handleSendOtp}
              disabled={!canSendOtp}
            >
              Send OTP
            </button>
          )}

          {otpSent && !otpVerified && (
            <>
              <div className="otp-input-row">
                {otp.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    className="otp-input"
                    maxLength={1}
                    inputMode="numeric"
                    value={d}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  />
                ))}
              </div>

              <div className="otp-actions">
                <button
                  type="button"
                  className="otp-verify-btn"
                  onClick={handleVerifyOtp}
                >
                  Verify OTP
                </button>

                <button
                  type="button"
                  className="otp-resend-btn"
                  onClick={handleSendOtp}
                >
                  Resend
                </button>
              </div>
            </>
          )}
        </div>

        <div className="auth-links-row">
          <a href="/signin" className="auth-link">
            Already have account? Sign In
          </a>
        </div>

        <div className="auth-submit-area">
          <button
            type="submit"
            className="auth-submit-btn"
            disabled={!otpVerified}
            style={{
              opacity: otpVerified ? 1 : 0.55,
              cursor: otpVerified ? "pointer" : "not-allowed",
            }}
          >
            REGISTER
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
