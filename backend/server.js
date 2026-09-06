import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);

// Serve Frontend Static Files
// This points Express to the parent folder containing your index.html
app.use(express.static(path.join(__dirname, '../')));

// Catch-all route to serve the frontend for any unhandled requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(PORT, () => {
  console.log(`
╔═════════════════════════════════════════╗
║    MAUSAM SETU — FULL STACK SERVER     ║
╚═════════════════════════════════════════╝
✓ API & Frontend running on: http://localhost:${PORT}
  `);
});