import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "Gmail",
    port: 465,
    secure: true,
    auth: {
        // user: 'linh3789az@gmail.com',
        // pass: 'onva nvdt rdkr bjwu',
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    }
});

// kiểm tra kết nối mail
transporter.verify((err, success) => {
  if (err) {
    console.log("SMTP verify failed:", err.message);
  } else {
    console.log("SMTP transporter is ready:", success);
  }
});