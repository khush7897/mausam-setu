/**
 * MAUSAM SETU — Authentication Routes
 * Handles user registration and login with bcryptjs password hashing
 */

import express from 'express';
import bcryptjs from 'bcryptjs';
import pool from '../db.js';

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

      return res.status(201).json({
        success: true,
        user: user,
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
      // Find user by mobile number or email
      const [rows] = await connection.query(
        'SELECT id, full_name, mobile_number, email, role, state, password_hash FROM users WHERE mobile_number = ? OR email = ?',
        [identifier, identifier.toLowerCase()]
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

      return res.status(200).json({
        success: true,
        user: session,
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

export default router;
