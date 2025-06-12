import express from 'express';
import { userRegister} from '../controllers/userRegisterController.js';

const router = express.Router();

router.get('/register', userRegister);

export default router;