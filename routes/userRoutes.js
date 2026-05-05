import express from 'express';
import * as userController from '../controllers/userController.js';
import { verifyToken, authorize } from '../middleware/auth.js';

const router = express.Router();

// User authentication and registration
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// User profile management
router.get('/profile/:userId', verifyToken, userController.getUserProfile);
router.put('/profile/:userId', verifyToken, userController.updateUserProfile);

// User statistics
router.get('/stats/:userId', verifyToken, userController.getUserStats);

// User administration
router.get('/', verifyToken, authorize(['admin']), userController.getAllUsers);
router.delete('/:userId', verifyToken, authorize(['admin']), userController.deleteUser);

export default router;
