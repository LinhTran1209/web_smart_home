import Account from "../models/accountsModel.js";
import EmailOtp from "../models/emailOtpModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find().sort({ createdAt: -1 });
    res.status(200).json(accounts);
    } catch (error) {
    console.error("error getAllAccounts", error);
    res.status(500).json({ message: "error getAllAccounts" });
  }
};

export const getAccountByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const account = await Account.findOne({ email: email});

        if (!account) {
            res.status(404).json({ message: "account not found"});
        };
        res.status(200).json(account);
    } catch (error) {
        console.error("error getAccountByEmail", error);
        res.status(500).json({ message: "error getAccountByEmail" });
    };
};

export const createAccount = async (req, res) => {
    try {
        const { email, password, full_name } = req.body;
        const newAccount = new Account({
            email,
            password,
            full_name,
        });

        const exittingAccount = await Account.findOne({ email: email});

        if (exittingAccount) {
            return res.status(400).json({ message: "email already exists" });
        }

        newAccount.save();
    } catch (error) {
        console.error("eror createAccount", error);
        res.status(500).json({ message: "error createAccount" });
    }
};

export const updateAccount = async (req, res) => {
    try {
        const { email} = req.params;
        const { password, full_name} = req.body;

        const updatedAccount = await Account.findOneAndUpdate(
            { email: email },
            { password, full_name },
            { new: true }
        );

        if (!updateAccount) {
            return res.status(404).json({ message: "account not found"});
        }

        res.status(200).json({ message: "Update account successfully"});
    } catch (error) {
        console.error("error updateAccount", error);
        res.status(500).json({ message: "error updateAccount" });
    }
};

export const deleteAccount = async (req, res) => {
    try {
        const { email} =req.params;
        const deleteAccount = await Account.findOneAndDelete({ email: email});

        if (!deleteAccount) {
            return res.status(404).json({ message: "account not found"});
        }
        res.status(200).json({ message: "Delete account successfully"});
    } catch (error) {
        console.error("error deleteAccount", error);
        res.status(500).json({ message: "error deleteAccount" });
    }
}

export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const normalizedEmail = email.trim().toLowerCase();

    // 1) check otp verified
    const otpRecord = await EmailOtp.findOne({ email: normalizedEmail });
    if (!otpRecord || !otpRecord.verified) {
      return res.status(400).json({ message: "Email not verified by OTP" });
    }

    // 2) check email duplicate (server-side)
    const existed = await Account.findOne({ email: normalizedEmail });
    if (existed) return res.status(400).json({ message: "Email already exists" });

    // 3) hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const newAcc = await Account.create({
      full_name: fullName,
      email: normalizedEmail,
      password: passwordHash,
    });

    // 4) xóa otp sau khi đăng ký xong
    await EmailOtp.deleteOne({ email: normalizedEmail });

    res.status(201).json({
      message: "Registered successfully",
      data: { email: newAcc.email, fullName: newAcc.full_name },
    });
  } catch (err) {
    console.error("register error", err);
    res.status(500).json({ message: "register error" });
  }
};

// POST /auth/login

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) return res.status(400).json({message: "Email is required"});
        if (!password) return res.status(400).json({message: "Password is required"});
        
        const account = await Account.findOne({ email: email});
        if (!account) return res.status(400).json({message: "Invalid email or password"});
        const isMatch = await bcrypt.compare(password, account.password);
        if (!isMatch) return res.status(400).json({message: "Invalid email or password"});


        // JWT 3 thành phần: Header + Payload + Secret
        const payload = {
            _id: account._id.toString(),
            email: account.email,
            full_name: account.full_name,
            role: account.role,
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN || "2h"}
        );

        return res.status(200).json({
            message: "Login successfully.",
            token: token,
            account: payload,
        })

    } catch (error) {
        console.error("login error", error);
        res.status(500).json({message: "Login error"})
    };
};

// POST /auth/logout
export const logout = async (req, res) => {
    try {
        return res.status(200).json({message: "Logout successfully."});
    } catch (error) {
        console.error("logout error", error);
        res.status(500).json({message: "Logout error"})
    }
};

// get /auth/me
export const me = async (req, res) => {
    try {
        return res.status(200).json({
            message: "Token is valid.",
            account: req.account,
        });
    } catch (error) {
        res.status(500).json({message: "Cannot get account info."})
    }
};
