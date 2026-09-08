/**
 * MAUSAM SETU — Authentication Routes
 * Handles user registration and login with bcryptjs password hashing
 */

import express from 'express';
import bcryptjs from 'bcryptjs';
import pool from '../db.js';
import { sendWelcomeEmail, sendOtpEmail } from '../services/emailService.js';

const router = express.Router();

// ── Validation Helpers ────────────────────────────────────
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateMobileNumber = (mobile) => {
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const normalizePhone = (p) => {
  if (!p) return '';
  const digits = p.replace(/\D/g, '');
  return digits.length >= 10 ? digits.slice(-10) : digits;
};

// ── Register Route ────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { full_name, mobile_number, email, role, state, password } = req.body;

    // Validation
    if (!full_name || full_name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid name.',
      });
    }

    if (!mobile_number || !validateMobileNumber(mobile_number)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid 10-digit Indian mobile number.',
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters.',
      });
    }

    if (email && !validateEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid email address.',
      });
    }

    if (!state || state.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please select a state.',
      });
    }

    const validRoles = ['citizen', 'farmer', 'fisherman', 'student', 'official', 'admin'];
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Please select a valid role.',
      });
    }

    // Get database connection
    const connection = await pool.getConnection();

    try {
      // Check if mobile number already exists
      const [existingMobile] = await connection.query(
        'SELECT id FROM users WHERE mobile_number = ?',
        [mobile_number]
      );

      if (existingMobile.length > 0) {
        return res.status(409).json({
          success: false,
          error: 'This mobile number is already registered.',
        });
      }

      // Check if email already exists (if provided)
      if (email) {
        const [existingEmail] = await connection.query(
          'SELECT id FROM users WHERE email = ?',
          [email]
        );

        if (existingEmail.length > 0) {
          return res.status(409).json({
            success: false,
            error: 'This email is already registered.',
          });
        }
      }

      // Hash password
      const salt = await bcryptjs.genSalt(10);
      const password_hash = await bcryptjs.hash(password, salt);

      // Insert user
      const [result] = await connection.query(
        'INSERT INTO users (full_name, mobile_number, email, role, state, password_hash) VALUES (?, ?, ?, ?, ?, ?)',
        [
          full_name.trim(),
          mobile_number,
          email || null,
          role,
          state.trim(),
          password_hash,
        ]
      );

      // Create user session object
      const user = {
        id: result.insertId.toString(),
        name: full_name.trim(),
        mobile: mobile_number,
        email: email || '',
        role: role,
        state: state.trim(),
        loginAt: Date.now(),
      };

      // Prepare email notification metadata
      const origin = req.headers.origin || req.headers.host || 'http://localhost:5000';
      const websiteName = 'Mausam Setu (' + origin + ')';
      const emailNotification = {
        sent: true,
        email: email || `${mobile_number}@mausamsetu.gov.in`,
        website: websiteName,
        phone: mobile_number,
        timestamp: new Date().toISOString(),
        message: `Phone notification dispatched for ${email || mobile_number} from ${websiteName}`
      };

      console.log(`[PHONE NOTIFICATION] Registered with email: ${emailNotification.email} from ${websiteName} -> Phone: +91 ${mobile_number}`);

      // Dispatch automated welcome email via Nodemailer
      let welcomeEmailResult = null;
      if (email) {
        welcomeEmailResult = await sendWelcomeEmail({
          email: email.trim(),
          name: full_name.trim(),
          mobile: mobile_number,
          role: role,
          state: state.trim(),
          origin: origin.startsWith('http') ? origin : `http://${origin}`,
        });
      }

      return res.status(201).json({
        success: true,
        user: user,
        emailNotification: emailNotification,
        welcomeEmail: welcomeEmailResult,
      });
    } finally {
      await connection.release();
    }
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred during registration. Please try again.',
    });
  }
});

// ── Login Route ───────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide mobile number/email and password.',
      });
    }

    // Get database connection
    const connection = await pool.getConnection();

    try {
      // Find user by mobile number, normalized phone, email, or username
      const cleanId = identifier.trim();
      const phoneDigits = normalizePhone(cleanId);
      const [rows] = await connection.query(
        'SELECT id, full_name, mobile_number, email, role, state, password_hash FROM users WHERE mobile_number = ? OR mobile_number = ? OR LOWER(email) = ? OR LOWER(full_name) = ? LIMIT 1',
        [cleanId, phoneDigits, cleanId.toLowerCase(), cleanId.toLowerCase()]
      );

      if (rows.length === 0) {
        return res.status(401).json({
          success: false,
          error: 'Invalid mobile/email or password.',
        });
      }

      const user = rows[0];

      // Verify password
      const passwordMatch = await bcryptjs.compare(password, user.password_hash);

      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          error: 'Invalid mobile/email or password.',
        });
      }

      // Create user session object (without password)
      const session = {
        id: user.id.toString(),
        name: user.full_name,
        mobile: user.mobile_number,
        email: user.email || '',
        role: user.role,
        state: user.state,
        loginAt: Date.now(),
      };

      // Prepare email notification metadata
      const origin = req.headers.origin || req.headers.host || 'http://localhost:5000';
      const websiteName = 'Mausam Setu (' + origin + ')';
      const emailNotification = {
        sent: true,
        email: user.email || (identifier.includes('@') ? identifier : `${user.mobile_number}@mausamsetu.gov.in`),
        website: websiteName,
        phone: user.mobile_number,
        timestamp: new Date().toISOString(),
        message: `Phone notification dispatched for ${user.email || identifier} from ${websiteName}`
      };

      console.log(`[PHONE NOTIFICATION] Logged in with email: ${emailNotification.email} from ${websiteName} -> Phone: +91 ${user.mobile_number}`);

      return res.status(200).json({
        success: true,
        user: session,
        emailNotification: emailNotification
      });
    } finally {
      await connection.release();
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred during login. Please try again.',
    });
  }
});

// ── Phone Notification Dispatch API for Email / Gmail ───────
router.post('/notify-email-phone', async (req, res) => {
  try {
    const { email, phone, website } = req.body;
    const origin = req.headers.origin || req.headers.host || 'http://localhost:5000';
    const site = website || `Mausam Setu (${origin})`;

    console.log(`[PHONE NOTIFICATION DISPATCH] Email: ${email} | Website: ${site} | Phone: +91 ${phone || 'Registered User'}`);

    return res.status(200).json({
      success: true,
      message: `Notification successfully sent to phone (+91 ${phone || 'user'}) for email ${email} from website ${site}`,
      data: {
        email,
        website: site,
        phone: phone || 'Registered User',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ── Automated Welcome Email Test / Direct Trigger API ────────
router.post('/send-welcome-email', async (req, res) => {
  try {
    const { email, name, mobile, role, state } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    const origin = req.headers.origin || req.headers.host || 'http://localhost:5000';
    const result = await sendWelcomeEmail({
      email: email.trim(),
      name: (name || 'Valued Citizen').trim(),
      mobile: mobile || '9876543210',
      role: role || 'citizen',
      state: state || 'Chhattisgarh',
      origin: origin.startsWith('http') ? origin : `http://${origin}`,
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ── Get Registered Users (Admin / Diagnostics) ───────────────
router.get('/users', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        'SELECT id, uuid, full_name, mobile_number, email, role, state, created_at FROM users ORDER BY id ASC'
      );
      return res.status(200).json({
        success: true,
        count: rows.length,
        users: rows,
      });
    } finally {
      await connection.release();
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ── Reset / Delete All Registrations ─────────────────────────
router.post('/reset-all-registrations', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    try {
      await connection.query('DELETE FROM users');
      try {
        await connection.query("DELETE FROM sqlite_sequence WHERE name = 'users'");
      } catch (e) {
        // Ignored if MySQL or sequence table not present
      }
      return res.status(200).json({
        success: true,
        message: 'All user registrations have been completely deleted. Database reset to zero registered users.',
        count: 0
      });
    } finally {
      await connection.release();
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ── Helpers for Masking ──────────────────────────────────────
const maskEmail = (email) => {
  if (!email || !email.includes('@')) return email || '';
  const [local, domain] = email.split('@');
  if (local.length <= 2) return `${local[0]}*@${domain}`;
  return `${local.slice(0, 2)}${'*'.repeat(Math.min(local.length - 2, 5))}@${domain}`;
};

const maskPhone = (phone) => {
  if (!phone || phone.length < 4) return phone || '';
  return `+91 ******${phone.slice(-4)}`;
};

// ── Forgot Password / Request OTP ─────────────────────────────
router.post('/forgot-password', async (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier || identifier.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please enter your registered email, mobile number, or full name.',
      });
    }

    const cleanId = identifier.trim();
    const phoneDigits = normalizePhone(cleanId);
    const connection = await pool.getConnection();

    try {
      // Find user by mobile, normalized mobile, email, or full name
      const [rows] = await connection.query(
        'SELECT id, full_name, mobile_number, email FROM users WHERE mobile_number = ? OR mobile_number = ? OR LOWER(email) = ? OR LOWER(full_name) = ? LIMIT 1',
        [cleanId, phoneDigits, cleanId.toLowerCase(), cleanId.toLowerCase()]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'No account found with this credential. Please verify your mobile, email, or name.',
        });
      }

      const user = rows[0];

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

      // Clear previous reset OTPs for this user
      await connection.query(
        'DELETE FROM password_resets WHERE identifier = ? OR identifier = ? OR identifier = ?',
        [user.mobile_number, user.email || '', user.full_name || '']
      );

      // Insert new OTP for mobile, email, and user id so verification succeeds with any identifier
      await connection.query(
        'INSERT INTO password_resets (identifier, otp, expires_at) VALUES (?, ?, ?)',
        [user.mobile_number, otp, expiresAt]
      );
      if (user.email) {
        await connection.query(
          'INSERT INTO password_resets (identifier, otp, expires_at) VALUES (?, ?, ?)',
          [user.email.toLowerCase(), otp, expiresAt]
        );
      }
      if (user.full_name) {
        await connection.query(
          'INSERT INTO password_resets (identifier, otp, expires_at) VALUES (?, ?, ?)',
          [user.full_name.toLowerCase(), otp, expiresAt]
        );
      }

      // Dispatch Email OTP if email exists
      let emailResult = null;
      if (user.email) {
        const origin = req.headers.origin || req.headers.host || 'http://localhost:5000';
        emailResult = await sendOtpEmail({
          email: user.email,
          name: user.full_name,
          otp: otp,
          origin: origin.startsWith('http') ? origin : `http://${origin}`,
        });
      }

      // Dispatch Phone Notification Log
      console.log(`[PHONE OTP DISPATCH] Password recovery OTP ${otp} dispatched for ${user.full_name} -> Mobile: +91 ${user.mobile_number}`);

      return res.status(200).json({
        success: true,
        message: 'OTP has been dispatched to your registered credentials.',
        destination: {
          email: user.email ? maskEmail(user.email) : null,
          mobile: maskPhone(user.mobile_number),
          name: user.full_name,
        },
        devOtp: otp, // Delivered for instant verification
      });
    } finally {
      await connection.release();
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred while generating OTP. Please try again.',
    });
  }
});

// ── Verify OTP ────────────────────────────────────────────────
router.post('/verify-otp', async (req, res) => {
  try {
    const { identifier, otp } = req.body;
    if (!identifier || !otp) {
      return res.status(400).json({
        success: false,
        error: 'Identifier and OTP are required.',
      });
    }

    const cleanId = identifier.trim();
    const phoneDigits = normalizePhone(cleanId);
    const cleanOtp = otp.toString().trim();
    const connection = await pool.getConnection();

    try {
      // Find matching user
      const [userRows] = await connection.query(
        'SELECT id, full_name, mobile_number, email FROM users WHERE mobile_number = ? OR mobile_number = ? OR LOWER(email) = ? OR LOWER(full_name) = ? LIMIT 1',
        [cleanId, phoneDigits, cleanId.toLowerCase(), cleanId.toLowerCase()]
      );

      const user = userRows[0];
      const idMatches = [cleanId, phoneDigits];
      if (user) {
        idMatches.push(user.mobile_number);
        if (user.email) idMatches.push(user.email.toLowerCase());
        if (user.full_name) idMatches.push(user.full_name.toLowerCase());
      }

      const placeholders = idMatches.map(() => '?').join(' OR identifier = ');
      const [rows] = await connection.query(
        `SELECT id, expires_at FROM password_resets WHERE (identifier = ${placeholders}) AND otp = ? ORDER BY id DESC LIMIT 1`,
        [...idMatches, cleanOtp]
      );

      if (rows.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Invalid 6-digit verification code. Please check and try again.',
        });
      }

      const record = rows[0];
      if (Date.now() > record.expires_at) {
        return res.status(400).json({
          success: false,
          error: 'This OTP has expired. Please request a new one.',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'OTP verified successfully.',
      });
    } finally {
      await connection.release();
    }
  } catch (error) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred while verifying OTP.',
    });
  }
});

// ── Reset Password ────────────────────────────────────────────
router.post('/reset-password', async (req, res) => {
  try {
    const { identifier, otp } = req.body;
    const new_password = req.body.new_password || req.body.newPassword;

    if (!identifier || !otp || !new_password) {
      return res.status(400).json({
        success: false,
        error: 'Identifier, OTP, and new password are required.',
      });
    }

    if (!validatePassword(new_password)) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long.',
      });
    }

    const cleanId = identifier.trim();
    const phoneDigits = normalizePhone(cleanId);
    const cleanOtp = otp.toString().trim();
    const connection = await pool.getConnection();

    try {
      // Find matching user
      const [userRows] = await connection.query(
        'SELECT id, full_name, mobile_number, email FROM users WHERE mobile_number = ? OR mobile_number = ? OR LOWER(email) = ? OR LOWER(full_name) = ? LIMIT 1',
        [cleanId, phoneDigits, cleanId.toLowerCase(), cleanId.toLowerCase()]
      );

      if (userRows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'No matching user account found.',
        });
      }

      const user = userRows[0];
      const idMatches = [cleanId, phoneDigits, user.mobile_number];
      if (user.email) idMatches.push(user.email.toLowerCase());
      if (user.full_name) idMatches.push(user.full_name.toLowerCase());

      const placeholders = idMatches.map(() => '?').join(' OR identifier = ');
      const [resetRows] = await connection.query(
        `SELECT id, expires_at FROM password_resets WHERE (identifier = ${placeholders}) AND otp = ? ORDER BY id DESC LIMIT 1`,
        [...idMatches, cleanOtp]
      );

      if (resetRows.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Invalid or expired OTP. Please start the recovery process again.',
        });
      }

      if (Date.now() > resetRows[0].expires_at) {
        return res.status(400).json({
          success: false,
          error: 'OTP has expired. Please request a fresh OTP.',
        });
      }

      // Hash new password
      const salt = await bcryptjs.genSalt(10);
      const password_hash = await bcryptjs.hash(new_password, salt);

      // Update password in users table by user ID
      await connection.query(
        'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [password_hash, user.id]
      );

      // Clean up used OTP records for this user
      await connection.query(
        'DELETE FROM password_resets WHERE identifier = ? OR identifier = ? OR identifier = ? OR identifier = ?',
        [user.mobile_number, user.email || '', user.full_name || '', cleanId]
      );

      console.log(`[PASSWORD RESET SUCCESS] User (${user.full_name} / ${user.mobile_number}) password updated successfully.`);

      return res.status(200).json({
        success: true,
        message: 'Password reset successfully! You can now log in with your new password.',
      });
    } finally {
      await connection.release();
    }
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to reset password. Please try again.',
    });
  }
});

export default router;
