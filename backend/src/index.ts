import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/database.js';
import authRoutes from './api/routes/auth.js';
import articleRoutes from './api/routes/articles.js';
import taskRoutes from './api/routes/tasks.js';
import mediaRoutes from './api/routes/media.js';
import analyticsRoutes from './api/routes/analytics.js';
import userRoutes from './api/routes/users.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = config.port;

// Middleware
app.use(cors({
  origin: config.corsOrigins,
  credentials: true
}));

// Configure Helmet with relaxed settings if we are hosting images locally to prevent CORS block issues
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(morgan(config.logLevel === 'dev' ? 'dev' : 'combined'));

// Maximize JSON payload limit for base64 file uploads
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Response Envelope Middleware (wraps res.json in { success: true, data } or { success: false, error })
app.use((req, res, next) => {
  const originalJson = res.json;
  res.json = function (body) {
    if (res.statusCode >= 400) {
      if (body && typeof body === 'object' && 'success' in body) {
        return originalJson.call(this, body);
      }
      return originalJson.call(this, {
        success: false,
        error: {
          message: body.message || body.error || 'An error occurred',
          code: body.error || 'SERVER_ERROR',
          details: body.details || null
        }
      });
    } else {
      if (body && typeof body === 'object' && 'success' in body) {
        return originalJson.call(this, body);
      }
      return originalJson.call(this, {
        success: true,
        data: body
      });
    }
  };
  next();
});

// Static files hosting for local media library uploads
app.use('/uploads', express.static(config.uploadDir));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/articles', articleRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/media', mediaRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/users', userRoutes);

// Health Check Route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'Axolotl-OS Backend is running',
    timestamp: new Date().toISOString(),
    databaseMode: config.isSupabaseConfigured() ? 'supabase' : 'local-json'
  });
});

// Error handling middleware
app.use(errorHandler);

// Start Server
app.listen(port, () => {
  console.log(`Axolotl-OS Server running on port ${port} [Mode: ${config.isSupabaseConfigured() ? 'Supabase' : 'Local File Fallback'}]`);
});
