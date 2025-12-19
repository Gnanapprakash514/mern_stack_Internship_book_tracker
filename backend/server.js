import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import bookRoutes from './routes/books.js';

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not set. Using a fallback secret is insecure for production.');
}

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection with improved logging and timeout
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mern_auth';
mongoose.set('strictQuery', false);
mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log(`MongoDB connected: ${mongoUri}`))
  .catch((err) => console.error('MongoDB connection error:', err && err.message ? err.message : err));

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

// Simple health check for Render and uptime monitoring
app.get('/health', (req, res) =>
  res.status(200).json({ status: 'ok', env: process.env.NODE_ENV || 'development', port: process.env.PORT || 5000 })
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Book Tracker Server running on port ${PORT} (NODE_ENV=${process.env.NODE_ENV || 'development'})`);
});