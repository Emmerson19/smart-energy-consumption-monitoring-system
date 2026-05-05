import express from 'express';
import * as alertController from '../controllers/alertController.js';

const router = express.Router();

// Threshold management
router.post('/:userId/thresholds', alertController.createThreshold);
router.get('/:userId/thresholds', alertController.getThresholds);
router.put('/thresholds/:thresholdId', alertController.updateThreshold);
router.delete('/thresholds/:thresholdId', alertController.deleteThreshold);

// Alert management
router.post('/:userId/alerts', alertController.createAlert);
router.get('/:userId/alerts', alertController.getAlerts);
router.get('/:userId/alerts/unresolved', alertController.getUnresolvedAlerts);
router.get('/:userId/alerts/stats', alertController.getAlertStats);
router.get('/devices/:deviceId/alerts', alertController.getAlertsByDevice);
router.put('/alerts/:alertId/resolve', alertController.resolveAlert);

export default router;
