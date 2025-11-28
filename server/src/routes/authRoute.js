// routes/authRoute.js
import express from "express";
import { sendOtp, verifyOtp, resetPasswordByOtp, } from "../controllers/otpController.js";
import { register, login, me } from "../controllers/accountsController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// otp verify
router.post("/send-otp", sendOtp);        
router.post("/verify-otp", verifyOtp);   
router.post("/register", register);
router.post("/reset-password", resetPasswordByOtp); 

// JWT auth
router.post("/login", login);
router.get("/me", verifyToken, me)

export default router;
