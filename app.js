import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./src/config/db.js";
import apiRoutes from "./src/routes/index.js";
import { notFound, errorHandler } from './src/middleware/errorMiddleware.js';

dotenv.config();

connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:3000", // URL do frontend LOCAL
  //'https://conecta-artesanato-frontend.vercel.app' Substitua pelo URL do Vercel
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg =
        "A política de CORS para este site não permite acesso da origem especificada.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
};

// Middleware
app.use(cors(corsOptions)); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

// Use morgan only in development mode
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // Log HTTP requests in development mode
}

// Api Routes
app.use("/api", apiRoutes);

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});
