import express from 'express';
import * as reportController from '../controllers/reportController.js';

const router = express.Router();

// Generate reports
router.get('/:userId/daily', reportController.generateDailyReport);
router.get('/:userId/monthly', reportController.generateMonthlyReport);
router.get('/:userId/yearly', reportController.generateYearlyReport);
router.get('/:userId/comparison', reportController.generateComparisonReport);

// Get insights
router.get('/:userId/insights', reportController.getConsumptionInsights);

export default router;
