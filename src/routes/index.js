import express from 'express';
import healthRoutes from './healthRoutes.js';

const router = express.Router();

// Define the base route for health checks
router.use('/', healthRoutes);

export default router;