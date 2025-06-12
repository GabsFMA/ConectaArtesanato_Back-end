import express from 'express';
import healthRoute from './healthRoute.js';
import userRegisterRoute from './userRegisterRoute.js';
import userLoginRoute from './userLoginRoute.js';

const router = express.Router();


router.use('/', healthRoute);
router.use('/', userRegisterRoute);
router.use('/auth', userLoginRoute);

export default router;