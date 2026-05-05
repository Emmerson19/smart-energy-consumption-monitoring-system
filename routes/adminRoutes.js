import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { verifyToken, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/backup', verifyToken, authorize(['admin']), adminController.exportBackup);
router.post('/backup/restore', verifyToken, authorize(['admin']), adminController.restoreBackup);
router.get('/audit-logs', verifyToken, authorize(['admin']), adminController.getAuditLogs);

export default router;
