import express from 'express';
import { handleShorten, handleGetStats, handleDelete, handleUpdate } from '../controllers/urlController.js';
import { shortenLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.post('/shorten', shortenLimiter, handleShorten);
router.get('/stats/:shortCode', handleGetStats);
router.delete('/:shortCode', handleDelete);
router.patch('/:shortCode', handleUpdate);

export default router;
