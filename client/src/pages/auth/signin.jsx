import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layouts/authLayout.jsx";
import InputForm from "../../components/forms/inputForm.jsx";
import SignInIllustration from "../../assets/images/img_auth/signin.svg";
import iconEmail from "../../assets/icons/email.svg";
import iconPassword from "../../assets/icons/password.svg";

import { toast } from "sonner";
import api, { fetchMe } from "../../utils/axios.js";
import isValidEmail from "../../utils/isValidEmail.js";

const AFTER_LOGIN_PATH = "/home"; 

const SignInPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    try {
      // login
      const res = await api.post("/auth/login", { email, password });
      console.log(res)
      const { token, account } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('account', JSON.stringify(account));

      // verify token ngay bằng /auth/me
      await fetchMe();

      toast.success("Login successfully!");
      setTimeout(() => navigate(AFTER_LOGIN_PATH), 600)

    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed.");
      console.error(err);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-illustration fade-in-up">
        <img src={SignInIllustration} alt="Sign in illustration" />
      </div>

      <form className="auth-form fade-in-up" onSubmit={handleSubmit}>
        <h2 className="auth-title">SIGN IN</h2>

        <InputForm
          type="email"
          name="email"
          label="Email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
          required
          icon={<img src={iconEmail} alt="@" style={{ width: 20, height: 20 }} />}
          // error={errors.email}
        />

        <InputForm
          type="password"
          name="password"
          label="Password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          required
          icon={<img src={iconPassword} alt="lock" style={{ width: 20, height: 20 }} />}
          // error={errors.password}
        />

        <div className="auth-links-row">
          <a href="/register" className="auth-link">Register?</a>
          <a href="/forgot-password" className="auth-link">Forgot password?</a>
        </div>

        <div className="auth-submit-area">
          <button type="submit" className="auth-submit-btn">
            SIGN IN
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignInPage;
