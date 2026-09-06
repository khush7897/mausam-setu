# Mausam Setu — Backend Setup Guide

## Overview
This guide walks you through setting up the Express.js backend with MySQL/MariaDB authentication system for Mausam Setu.

---

## Step 1: Database Setup

### 1.1 Create Database and Table

Open your MySQL/MariaDB client (MySQL Workbench, command line, or phpMyAdmin) and run the SQL script:

```sql
-- From: backend/database.sql
CREATE DATABASE IF NOT EXISTS mausam_setu;
USE mausam_setu;

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
```

**Or use the SQL file directly:**
```bash
mysql -u root < backend/database.sql
```

---

## Step 2: Node.js Environment Setup

### 2.1 Navigate to Backend Folder
```bash
cd backend
```

### 2.2 Initialize Node Project
```bash
npm init -y
```

### 2.3 Install Dependencies
```bash
npm install express mysql2 cors bcryptjs dotenv
```

### 2.4 (Optional) Install Development Dependencies
```bash
npm install --save-dev nodemon
```

---

## Step 3: Environment Configuration

### 3.1 Create/Update `.env` File
The `.env.example` is provided. Copy and configure it:

```bash
cp .env.example .env
```

### 3.2 Edit `.env` with Your Database Credentials
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=mausam_setu
DB_PORT=3306

# Server Configuration
SERVER_PORT=5000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

**Important:** Update `DB_PASSWORD` with your MySQL root password.

---

## Step 4: Project Structure

After setup, your backend folder should look like:
```
backend/
├── node_modules/
├── routes/
│   └── auth.js           (Auth routes)
├── .env                  (Configuration)
├── .env.example          (Template)
├── database.sql          (Database schema)
├── db.js                 (Database connection pool)
├── package.json          (Dependencies)
└── server.js             (Main server)
```

---

## Step 5: Running the Backend

### 5.1 Development Mode (with auto-reload)
```bash
npm run dev
```

### 5.2 Production Mode
```bash
npm start
```

**Expected Output:**
```
╔═════════════════════════════════════════╗
║    MAUSAM SETU — Authentication API    ║
╚═════════════════════════════════════════╝

✓ Server running on: http://localhost:5000
✓ Environment: development
✓ Database: mausam_setu

Available Endpoints:
  POST   /api/auth/register
  POST   /api/auth/login
  GET    /health
```

---

## Step 6: Testing the API

### 6.1 Test Health Check
```bash
curl http://localhost:5000/health
```

### 6.2 Test Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test User",
    "mobile_number": "9876543210",
    "email": "test@example.com",
    "password": "password123",
    "role": "citizen",
    "state": "Delhi"
  }'
```

### 6.3 Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "9876543210",
    "password": "password123"
  }'
```

---

## Step 7: Frontend Integration

The frontend `js/auth.js` has already been updated to:
- Use the backend API at `http://localhost:5000/api/auth`
- Call `/register` and `/login` endpoints
- Store user session in localStorage after successful authentication
- Return the same API contract: `{ success: true/false, user: {...}, error: "..." }`

**No changes needed to UI code** — the API contract remains the same!

---

## API Endpoints

### Register Endpoint
```
POST /api/auth/register

Request:
{
  "full_name": "John Doe",
  "mobile_number": "9876543210",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "citizen",
  "state": "Delhi"
}

Response (Success):
{
  "success": true,
  "user": {
    "id": "1",
    "name": "John Doe",
    "mobile": "9876543210",
    "email": "john@example.com",
    "role": "citizen",
    "state": "Delhi",
    "loginAt": 1694793600000
  }
}

Response (Error):
{
  "success": false,
  "error": "This mobile number is already registered."
}
```

### Login Endpoint
```
POST /api/auth/login

Request:
{
  "identifier": "9876543210",  // Can be mobile or email
  "password": "securePassword123"
}

Response (Success):
{
  "success": true,
  "user": {
    "id": "1",
    "name": "John Doe",
    "mobile": "9876543210",
    "email": "john@example.com",
    "role": "citizen",
    "state": "Delhi",
    "loginAt": 1694793600000
  }
}

Response (Error):
{
  "success": false,
  "error": "Invalid mobile/email or password."
}
```

---

## Troubleshooting

### Database Connection Error
- Ensure MySQL/MariaDB is running
- Check `DB_HOST`, `DB_USER`, `DB_PASSWORD` in `.env`
- Verify the database `mausam_setu` exists

### Port Already in Use
- Change `SERVER_PORT` in `.env` to an available port (e.g., 5001)

### CORS Errors in Frontend
- Update `CORS_ORIGIN` in `.env` to match your frontend URL
- Default: `http://localhost:3000`

### Password Hash Errors
- Ensure `bcryptjs` is installed: `npm install bcryptjs`
- Restart the server after installation

---

## Security Notes

1. **Never commit `.env`** — Add to `.gitignore`
2. **Hash passwords with bcryptjs** — Already implemented
3. **Use HTTPS in production** — Update API_BASE_URL in frontend
4. **Validate all inputs** — Server-side validation implemented
5. **Store sensitive data securely** — Passwords are hashed before storage

---

## Next Steps

1. ✅ Set up database
2. ✅ Configure environment
3. ✅ Install dependencies
4. ✅ Run backend server
5. ✅ Test API endpoints
6. ✅ Open frontend and test login/registration

---

## Files Created

- `backend/database.sql` — Database schema
- `backend/db.js` — MySQL connection pool
- `backend/routes/auth.js` — Authentication routes
- `backend/server.js` — Express server
- `backend/package.json` — Node dependencies
- `backend/.env` — Configuration (⚠️ Update with your settings)
- `backend/.env.example` — Configuration template
- `js/auth.js` — Updated frontend service (already modified)

---

## Support

For issues or questions, refer to:
- [Express.js Docs](https://expressjs.com/)
- [MySQL2 Docs](https://github.com/sidorares/node-mysql2)
- [Bcryptjs Docs](https://www.npmjs.com/package/bcryptjs)
