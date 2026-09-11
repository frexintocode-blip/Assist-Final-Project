// index.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'; // 1. Import cookie-parser
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors({
    origin: true, 
    credentials: true 
}));
app.use(express.json());
app.use(cookieParser()); // 3. Register cookie-parser middleware

// Main Routing Mounting Handlers
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/uploads', express.static('uploads'));

// Global Error Handler Engine
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`ASSIT Secure Engine running on port ${PORT}`));
}

export default app;