# Mausam Setu — Quick Commands Reference

## Quick Start (Zero-Config)

Mausam Setu comes with **dual-database support**:
1. **Automatic SQLite (Zero Configuration)**: Works instantly on any machine with Node.js. No MySQL server installation needed!
2. **MySQL / MariaDB**: If you have MySQL installed and configured in `.env`, the server automatically connects to MySQL.

### 1. Install Dependencies
From the repository root or `backend/`:
```bash
# If using Windows PowerShell and scripts are restricted, use npm.cmd
cd backend
npm install
# or: npm.cmd install
```

### 2. Configure Environment (Optional)
A default `.env` is pre-configured with `DB_TYPE=auto`. If you want to use MySQL:
```bash
cp .env.example .env
# Edit backend/.env to set DB_USER, DB_PASSWORD, and DB_NAME
```

### 3. Run Database Setup (Optional)
To verify or initialize the schema and seed default demo accounts:
```bash
npm run setup
# or from root: npm run setup
```

### 4. Start Server
```bash
# From project root:
npm start

# Or from backend folder:
cd backend
npm start
# for development with auto-reload:
npm run dev
```

Frontend and Backend will be live at: **http://localhost:5000**

---

## Pre-Seeded Demo Accounts

You can immediately log in on **http://localhost:5000/login.html** with:
| Role | Email / Mobile | Password |
|---|---|---|
| **Citizen** | `user@demo.com` / `9876543210` | `demo123` |
| **Farmer** | `farmer@demo.com` / `9123456789` | `demo123` |
| **Fisherman** | `fish@demo.com` / `9012345678` | `demo123` |
| **Admin** | `admin@mausam.gov` / `9000000000` | `admin123` |

---

## Testing with cURL / HTTP

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Register New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Arjun Singh",
    "mobile_number": "9876543210",
    "email": "arjun@example.com",
    "password": "password123",
    "role": "citizen",
    "state": "Delhi"
  }'
```

### Login User (by mobile or email)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "user@demo.com",
    "password": "demo123"
  }'
```

---

## Troubleshooting

### Windows PowerShell "npm.ps1 cannot be loaded"
If Windows blocks PowerShell scripts, use:
```powershell
npm.cmd install
npm.cmd start
```

### Port 5000 Already in Use
Change the port in `backend/.env`:
```env
SERVER_PORT=5001
```

### Switch explicitly between MySQL and SQLite
In `backend/.env`:
```env
DB_TYPE=sqlite   # Forces embedded SQLite database
# or
DB_TYPE=mysql    # Forces MySQL (requires MySQL service running)
# or
DB_TYPE=auto     # Checks MySQL, falls back to SQLite seamlessly
```
