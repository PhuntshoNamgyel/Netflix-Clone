const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");

const prisma = new PrismaClient();
const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { error: "Too many authentication attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Email transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Validation middleware
const validateSignup = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
];

const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// JWT Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.userId = decoded.userId;
    next();
  });
}

// --------- NEW: /me endpoint ---------
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isEmailVerified: true,
        preferences: true,
        createdAt: true,
      }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error('Fetch current user error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// --------- END /me endpoint ---------

// Helper functions
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId, type: 'access' },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: email,
    subject: 'Verify Your Email - Netflix Clone',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Netflix Clone!</h2>
        <p>Please verify your email address by clicking the button below:</p>
        <a href="${verificationUrl}" style="background-color: #e50914; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Verify Email
        </a>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p>${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
      </div>
    `
  });
};

// User Registration
router.post("/signup", authLimiter, validateSignup, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Validation failed",
        details: errors.array()
      });
    }

    // Lowercase email
    const email = req.body.email.toLowerCase();
    const { password, name } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      // If user is not verified, allow resend verification email
      if (!existingUser.isEmailVerified) {
        return res.status(409).json({
          error: "User with this email already exists but is not verified",
          canResendVerification: true
        });
      }
      return res.status(409).json({
        error: "User with this email already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate email verification token
    const emailVerifyToken = crypto.randomBytes(32).toString('hex');
    const emailVerifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user (email is not verified yet)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        emailVerifyToken,
        emailVerifyExpires,
        isEmailVerified: false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
      }
    });

    // Send verification email
    try {
      await sendVerificationEmail(email, emailVerifyToken);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail registration if email fails
    }

    res.status(201).json({
      message: "User registered successfully. Please check your email for verification.",
      user
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      error: "Internal server error during registration"
    });
  }
});

// Email Verification
router.post("/verify-email", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Verification token is required" });
    }

    const user = await prisma.user.findFirst({
      where: {
        emailVerifyToken: token,
        emailVerifyExpires: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({
        error: "Invalid or expired verification token"
      });
    }

    // Update user verification status
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerifyToken: null,
        emailVerifyExpires: null,
      }
    });

    res.json({
      message: "Email verified successfully"
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      error: "Internal server error during email verification"
    });
  }
});

// Resend Verification Email
router.post("/resend-verification", authLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Lowercase email for lookup
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.isEmailVerified) {
      return res.status(400).json({ error: "Email is already verified" });
    }

    // Generate new token and expiry
    const emailVerifyToken = crypto.randomBytes(32).toString('hex');
    const emailVerifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Update user with new token/expiry
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerifyToken,
        emailVerifyExpires,
      }
    });

    // Send verification email
    try {
      await sendVerificationEmail(user.email, emailVerifyToken);
    } catch (emailError) {
      console.error('Resend email error:', emailError);
      return res.status(500).json({ error: "Failed to send verification email" });
    }

    res.json({ message: "Verification email resent successfully" });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete Unverified User (dev/admin only, not for public/production use)
router.post("/delete-unverified", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.isEmailVerified) {
      return res.status(400).json({ error: "User is already verified. Not deleting." });
    }

    await prisma.user.delete({ where: { id: user.id } });

    res.json({ message: "Unverified user deleted successfully" });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// User Login
router.post("/login", authLimiter, validateLogin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Validation failed",
        details: errors.array()
      });
    }

    // Lowercase email for lookup
    const email = req.body.email.toLowerCase();
    const { password, rememberMe = false } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password"
      });
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > new Date()) {
      return res.status(423).json({
        error: "Account temporarily locked due to too many failed attempts"
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      // Increment login attempts
      const updatedAttempts = (user.loginAttempts || 0) + 1;
      const lockUntil = updatedAttempts >= 5 ?
        new Date(Date.now() + 30 * 60 * 1000) : // Lock for 30 minutes
        null;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          loginAttempts: updatedAttempts,
          lockUntil
        }
      });

      return res.status(401).json({
        error: "Invalid email or password",
        attemptsRemaining: lockUntil ? 0 : 5 - updatedAttempts
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(403).json({
        error: "Please verify your email before logging in"
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    // Save refresh token and reset login attempts
    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken,
        lastLogin: new Date(),
        loginAttempts: 0,
        lockUntil: null,
      }
    });

    // Create session
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    });

    // Set HTTP-only cookies if remember me is selected
    if (rememberMe) {
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
    }

    res.json({
      message: "Login successful",
      accessToken,
      refreshToken: rememberMe ? undefined : refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        preferences: user.preferences,
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: "Internal server error during login"
    });
  }
});

module.exports = router;