import express from 'express';
import { handleRedirect } from '../controllers/urlController.js';
import { redirectLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.get('/:shortCode', redirectLimiter, handleRedirect);

export default router;
