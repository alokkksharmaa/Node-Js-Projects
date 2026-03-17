import express from 'express';
import { handleRedirect } from '../controllers/urlController.js';
import { createRedirectLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.get('/:shortCode', createRedirectLimiter(), handleRedirect);

export default router;
