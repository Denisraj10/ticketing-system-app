import express from 'express';
import { login, logout, getCurrentUser } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.get('/logout', logout);
router.get('/me', authMiddleware, getCurrentUser);

export default router;
