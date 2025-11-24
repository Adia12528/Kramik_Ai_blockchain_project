import express from 'express';
import * as aiChatController from '../controllers/aiChatController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Chat endpoint
router.post('/chat', aiChatController.chat);

// Get conversation history
router.get('/history/:sessionId', aiChatController.getHistory);

// Clear conversation history
router.delete('/history/:sessionId', aiChatController.clearHistory);

// Get available providers and models
router.get('/providers', aiChatController.getProviders);

export default router;
