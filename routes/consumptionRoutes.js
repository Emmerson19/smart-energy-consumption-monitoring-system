import express from 'express';
import * as consumptionController from '../controllers/consumptionController.js';

const router = express.Router();

// Record consumption data
router.post('/:userId/devices/:deviceId/consumption', consumptionController.recordConsumption);

// Get consumption data
router.get('/:userId/consumption', consumptionController.getUserConsumption);
router.get('/:userId/devices/:deviceId/consumption', consumptionController.getDeviceConsumption);

// Get consumption by period
router.get('/:userId/consumption/daily', consumptionController.getDailyConsumption);
router.get('/:userId/consumption/monthly', consumptionController.getMonthlyConsumption);
router.get('/:userId/consumption/hourly', consumptionController.getHourlyConsumption);

// Get consumption analytics
router.get('/:userId/consumption/trend', consumptionController.getConsumptionTrend);
router.get('/:userId/devices/comparison', consumptionController.getDeviceComparison);

export default router;
