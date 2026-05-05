import * as consumptionService from '../services/consumptionService.js';
import * as demoDataService from '../services/demoDataService.js';
import Alert from '../models/Alert.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/responseFormatter.js';

export const recordConsumption = async (req, res) => {
    try {
        const { consumption, voltage, current, powerFactor, cost, period } = req.body;

        if (!consumption) {
            return errorResponse(res, 400, 'Consumption value is required');
        }

        const result = await consumptionService.recordConsumption(
            req.params.userId,
            req.params.deviceId,
            { consumption, voltage, current, powerFactor, cost, period }
        );

        if (!result.success) {
            return errorResponse(res, 400, result.error);
        }

        return successResponse(res, 201, 'Consumption recorded successfully', result.consumption);
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};

export const getDeviceConsumption = async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 100, 500);
        const page = parseInt(req.query.page) || 1;
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;

        const result = await consumptionService.getConsumptionByDevice(
            req.params.deviceId,
            startDate,
            endDate,
            limit,
            page
        );

        if (!result.success) {
            return errorResponse(res, 400, result.error);
        }

        return paginatedResponse(
            res,
            200,
            'Consumption data retrieved',
            result.consumptions,
            result.pagination.page,
            limit,
            result.pagination.total
        );
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};

export const getUserConsumption = async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 100, 500);
        const page = parseInt(req.query.page) || 1;
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;

        const result = await consumptionService.getConsumptionByUser(
            req.params.userId,
            startDate,
            endDate,
            limit,
            page
        );

        if (!result.success) {
            return errorResponse(res, 400, result.error);
        }

        return paginatedResponse(
            res,
            200,
            'Consumption data retrieved',
            result.consumptions,
            result.pagination.page,
            limit,
            result.pagination.total
        );
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};

export const getDailyConsumption = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return errorResponse(res, 400, 'Date parameter is required');
        }

        const result = await consumptionService.getDailyConsumption(req.params.userId, new Date(date));

        if (!result.success) {
            return errorResponse(res, 400, result.error);
        }

        return successResponse(res, 200, 'Daily consumption retrieved', result);
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};

export const getMonthlyConsumption = async (req, res) => {
    try {
        const { year, month } = req.query;

        if (!year || !month) {
            return errorResponse(res, 400, 'Year and month parameters are required');
        }

        const result = await consumptionService.getMonthlyConsumption(
            req.params.userId,
            parseInt(year),
            parseInt(month)
        );

        if (!result.success) {
            return errorResponse(res, 400, result.error);
        }

        return successResponse(res, 200, 'Monthly consumption retrieved', result);
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};

export const getHourlyConsumption = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return errorResponse(res, 400, 'Date parameter is required');
        }

        const result = await consumptionService.getHourlyConsumption(req.params.userId, new Date(date));

        if (!result.success) {
            return errorResponse(res, 400, result.error);
        }

        return successResponse(res, 200, 'Hourly consumption retrieved', result);
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};

export const getConsumptionTrend = async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;

        const result = await consumptionService.getConsumptionTrend(req.params.userId, days);

        if (!result.success) {
            return errorResponse(res, 400, result.error);
        }

        return successResponse(res, 200, 'Consumption trend retrieved', result);
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};

export const getDeviceComparison = async (req, res) => {
    try {
        const result = await consumptionService.getDeviceComparison(req.params.userId);

        if (!result.success) {
            return errorResponse(res, 400, result.error);
        }

        return successResponse(res, 200, 'Device comparison retrieved', result.comparison);
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};

export const seedDemoData = async (req, res) => {
    try {
        // Verify user is accessing their own data or is admin
        if (req.userId !== req.params.userId && req.userRole !== 'admin') {
            return errorResponse(res, 403, 'Unauthorized access');
        }

        const result = await demoDataService.seedDemoConsumptionData(req.params.userId);

        if (!result.success) {
            return errorResponse(res, 400, result.error);
        }

        return successResponse(res, 201, 'Demo data seeded successfully', {
            message: result.message,
            devices: result.devices,
            records: result.created
        });
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};

export const clearDemoData = async (req, res) => {
    try {
        // Verify user is accessing their own data or is admin
        if (req.userId !== req.params.userId && req.userRole !== 'admin') {
            return errorResponse(res, 403, 'Unauthorized access');
        }

        const result = await demoDataService.clearDemoData(req.params.userId);

        if (!result.success) {
            return errorResponse(res, 400, result.error);
        }

        return successResponse(res, 200, 'Demo data cleared successfully', {
            consumptionDeleted: result.consumptionDeleted,
            devicesDeleted: result.devicesDeleted,
            alertsDeleted: result.alertsDeleted
        });
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};

export const getConsumptionWithAlerts = async (req, res) => {
    try {
        // Get recent consumption records
        const limit = Math.min(parseInt(req.query.limit) || 10, 100);
        const page = parseInt(req.query.page) || 1;

        const result = await consumptionService.getConsumptionByUser(
            req.params.userId,
            req.query.startDate,
            req.query.endDate,
            limit,
            page
        );

        if (!result.success) {
            return errorResponse(res, 400, result.error);
        }

        // Get high consumption alerts
        const alerts = await demoDataService.getHighConsumptionAlerts(req.params.userId);

        return successResponse(res, 200, 'Consumption data with alerts retrieved', {
            consumption: result.consumptions,
            pagination: result.pagination,
            alerts: alerts,
            alertCount: alerts.length
        });
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};