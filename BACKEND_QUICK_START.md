# Mausam Setu — Quick Commands Reference

## Initial Setup

### 1. Create Database
```bash
mysql -u root < backend/database.sql
```

### 2. Install Dependencies
```bash
cd backend
npm install express mysql2 cors bcryptjs dotenv
```

### 3. Configure Environment
```bash
# Edit backend/.env with your database password
nano .env
# or
vim .env
```

### 4. Start Backend Server
```bash
npm start
# or for development with auto-reload:
npm run dev
```

---

## Testing with cURL

### Health Check
```bash
curl http://localhost:5000/health
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

### Login User (by mobile)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "9876543210",
    "password": "password123"
  }'
```

### Login User (by email)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "arjun@example.com",
    "password": "password123"
  }'
```

---

## Database Queries

### Check All Users
```bash
mysql -u root mausam_setu -e "SELECT id, full_name, mobile_number, email, role, state FROM users;"
```

### Check Single User
```bash
mysql -u root mausam_setu -e "SELECT * FROM users WHERE mobile_number = '9876543210';"
```

### Clear All Users
```bash
mysql -u root mausam_setu -e "TRUNCATE TABLE users;"
```

---

## Troubleshooting

### Node.js Not Installed
```bash
# Windows: Download from nodejs.org or use:
# macOS:
brew install node

# Linux (Ubuntu/Debian):
sudo apt-get install nodejs npm
```

### MySQL/MariaDB Connection Issues
```bash
# Check if MySQL is running
mysql -u root -p

# If password is blank, just press Enter
mysql -u root
```

### Port 5000 Already in Use
```bash
# Find process using port 5000 (Linux/macOS)
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change port in backend/.env
SERVER_PORT=5001
```

### Clear Node Modules and Reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Development Tips

1. **Use Nodemon for Auto-Reload**
   ```bash
   npm install --save-dev nodemon
   npm run dev
   ```

2. **View Server Logs**
   ```bash
   # Logs are printed to console
   # Look for timestamps and error messages
   ```

3. **Test API in Postman**
   - Import requests from this guide
   - Set `http://localhost:5000` as base URL
   - Test all endpoints with JSON bodies

4. **Enable MySQL Logging**
   ```bash
   # Edit .env and set debug mode if needed
   ```

---

## Production Deployment

### Environment Variables for Production
```env
DB_HOST=your-db-host.com
DB_USER=prod_user
DB_PASSWORD=secure_password_here
DB_NAME=mausam_setu
SERVER_PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
```

### Deploy on Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set DB_HOST=your-db
heroku config:set DB_PASSWORD=secure_pass

# Deploy
git push heroku main
```

---

## File Structure
```
mausam-setu/
├── backend/
│   ├── routes/
│   │   └── auth.js
│   ├── node_modules/
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── database.sql
│   ├── db.js
│   ├── package.json
│   ├── server.js
│   └── SETUP.md
├── js/
│   ├── auth.js (Updated)
│   ├── ... (other files)
└── ... (frontend files)
```

---

## API Response Format

All responses follow this format:
```json
{
  "success": true/false,
  "user": { /* user object if success */ },
  "error": "error message if failed"
}
```

---

For detailed setup instructions, see `SETUP.md`
