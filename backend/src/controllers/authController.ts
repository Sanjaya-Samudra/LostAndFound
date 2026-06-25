import { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/User";

// reCAPTCHA verification helper
const verifyRecaptcha = async (token: string): Promise<boolean> => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    // If no secret key is configured, warn but allow for development
    console.warn("reCAPTCHA Secret Key not configured in .env. Simulating validation.");
    return true;
  }

  try {
    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secretKey}&response=${token}`,
    });
    const data: any = await response.json();
    return data.success;
  } catch (error) {
    console.error("reCAPTCHA validation error:", error);
    return false;
  }
};

// Simulated email verification sender
const sendVerificationEmail = async (email: string, token: string) => {
  const verifyUrl = `${process.env.APP_URL || "http://localhost:5173"}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;
  console.log(`[Email Service Simulation] Send mail to ${email}`);
  console.log(`[Email Service Simulation] Click link to verify: ${verifyUrl}`);
  
  // In production, configure nodemailer:
  /*
  const nodemailer = require("nodemailer");
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    }
  });
  await transporter.sendMail({
    from: '"LostFound Support" <noreply@lostfound.com>',
    to: email,
    subject: "Verify Your Email Address",
    html: `<p>Please click the link below to verify your email address:</p><a href="${verifyUrl}">Verify Email</a>`
  });
  */
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password, recaptchaToken } = req.body;

    if (!firstName || !lastName || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    // 1. Verify reCAPTCHA token
    if (recaptchaToken) {
      const isCaptchaValid = await verifyRecaptcha(recaptchaToken);
      if (!isCaptchaValid) {
        res.status(400).json({ message: "Invalid reCAPTCHA verification" });
        return;
      }
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email is already registered" });
      return;
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // 5. Create new unverified user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken,
      role: "student",
    });

    await newUser.save();

    // 6. Send verification email
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      message: "Registration successful. Please check your email to verify your account.",
      email: newUser.email,
    });
  } catch (error: any) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      res.status(400).json({ message: "Invalid or expired verification token" });
      return;
    }

    user.isVerified = true;
    user.verificationToken = undefined; // clear token
    await user.save();

    res.status(200).json({ message: "Email verified successfully. You can now log in." });
  } catch (error: any) {
    console.error("Verify Email Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid login credentials" });
      return;
    }

    // Check if account is verified
    if (!user.isVerified) {
      res.status(403).json({ 
        message: "Email is not verified. Please check your inbox for verification instructions.",
        unverified: true 
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid login credentials" });
      return;
    }

    // In a full production implementation, generate a JWT token here:
    // const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
