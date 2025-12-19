import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import bookRoutes from './routes/books.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mern_auth');

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log('Book Tracker Server running on port 5000');
});