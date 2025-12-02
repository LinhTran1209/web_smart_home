import "./assets/styles/index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import NotFound from "./pages/notfound/index.jsx";
import LandingPage from "./pages/landing/index.jsx";
import SignInPage from "./pages/auth/signin.jsx";
import RegisterPage from "./pages/auth/register.jsx";
import ForgotPassword from "./pages/auth/forgotPassword.jsx";
import HomePage from "./pages/dashboard/home.jsx";
import Buildings from "./pages/dashboard/buildings.jsx";

import { Toaster } from "sonner";
import { RequireAuth, RequireGuest } from "./pages/routes/protectedRoute.jsx";
import DashboardLayout from "./components/layouts/dashboardLayout.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Toaster richColors />
    <BrowserRouter>
      <Routes>
        {/* ===== AUTH / LANDING (Guest only) ===== */}
        <Route element={<RequireGuest redirectTo="/home" />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* ===== PRIVATE (must login) + DASHBOARD LAYOUT CHUNG ===== */}
        <Route element={<RequireAuth redirectTo="/signin" />}>
          <Route element={<DashboardLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/buildings" element={<Buildings />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
