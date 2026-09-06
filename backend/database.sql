-- ============================================
-- MAUSAM SETU - Database Schema
-- ============================================

-- Create Database
CREATE DATABASE IF NOT EXISTS mausam_setu;
USE mausam_setu;

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uuid VARCHAR(36) UNIQUE NOT NULL DEFAULT (UUID()),
  full_name VARCHAR(255) NOT NULL,
  mobile_number VARCHAR(10) NOT NULL UNIQUE,
  email VARCHAR(255),
  role ENUM('citizen', 'farmer', 'fisherman', 'student', 'official') NOT NULL DEFAULT 'citizen',
  state VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_mobile (mobile_number),
  INDEX idx_email (email),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- END OF SCHEMA
-- ============================================
