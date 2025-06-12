import express from 'express';
import { userLogin} from '../controllers/userLoginController.js';

const router = express.Router();

router.get('/login', userLogin);

export default router;