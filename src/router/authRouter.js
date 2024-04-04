import express from 'express';
import authController from '../controller/authController.js';

const router = express.Router();

router.post('/auth/login', authController.login).post('/auth/register', authController.register);

export default router;
