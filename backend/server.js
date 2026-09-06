import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import pool, { initDatabase } from './db.js';

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'Mausam Setu Backend',
    database: pool.getEngine() || 'initializing',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);

// Serve Frontend Static Files from repository root
app.use(express.static(path.join(__dirname, '../')));

// Catch-all route to serve index.html for client-side navigation (ignoring API paths)
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Initialize database and start server
const startServer = async () => {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      const dbEngine = pool.getEngine();
      console.log(`
╔═════════════════════════════════════════╗
║    MAUSAM SETU — FULL STACK SERVER     ║
╚═════════════════════════════════════════╝
✓ Mode: ${process.env.NODE_ENV || 'development'}
✓ Database Engine: ${dbEngine.toUpperCase()}
✓ Server & Frontend URL: http://localhost:${PORT}
✓ Health Check: http://localhost:${PORT}/api/health
✓ Auth API: http://localhost:${PORT}/api/auth
      `);
    });
  } catch (err) {
    console.error('Failed to initialize server:', err);
    process.exit(1);
  }
};

startServer();