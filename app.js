import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './src/config/db.js';
import apiRoutes from './src/routes/index.js';

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

// Use morgan only in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Log HTTP requests in development mode
}

// Api Routes
app.use('/api', apiRoutes);

// Middleware for handling 404 errors
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ops! Route not found.🧑‍🦯‍➡️' });
});

// Middleware for error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server! 🤯' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});