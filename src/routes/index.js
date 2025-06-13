import express from 'express';
import healthRoute from './healthRoute.js';
import authRoutes from './authRoutes.js';
import profileRoutes from './profileRoutes.js'; 
import artisanRoutes from './artisanRoutes.js';
//import productRoutes from './productRoutes.js'; // <-- Adicionar no futuro
//import cartRoutes from './cartRoutes.js';     // <-- Adicionar no futuro

const router = express.Router();

// Rotas públicas
router.use('/', healthRoute);
router.use('/auth', authRoutes);
router.use('/artisans', artisanRoutes);
//router.use('/products', productRoutes);

// Rotas protegidas
router.use('/profile', profileRoutes);
//router.use('/cart', cartRoutes);     // <-- Adicionar no futuro

export default router;