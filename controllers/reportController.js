import * as reportService from '../services/reportService.js';
import { successResponse, errorResponse } from '../utils/responseFormatter.js';

export const generateDailyReport = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return errorResponse(res, 400, 'Date parameter is required');
        }

        const result = await reportService.generateDailyReport(req.params.userId, new Date(date));

        if (!result.success) {
            return errorResponse(res, 400, result.error);
        }

        return successResponse(res, 200, 'Daily report generated', result.report);
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};

export const generateMonthlyReport = async (req, res) => {
    try {
        const { year, month } = req.query;

        if (!year || !month) {
            return errorResponse(res, 400, 'Year and month parameters are required');
        }

        const result = await reportService.generateMonthlyReport(
            req.params.userId,
            parseInt(year),
            parseInt(month)
        );

        if (!result.success) {
            return errorResponse(res, 400, result.error);
        }

        return successResponse(res, 200, 'Monthly report generated', result.report);
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};

export const generateYearlyReport = async (req, res) => {
    try {
        const { year } = req.query;

        if (!year) {
            return errorResponse(res, 400, 'Year parameter is required');
        }

        const result = await reportService.generateYearlyReport(req.params.userId, parseInt(year));

        if (!result.success) {
            return errorResponse(res, 400, result.error);
        }

        return successResponse(res, 200, 'Yearly report generated', result.report);
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};

export const generateComparisonReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return errorResponse(res, 400, 'Start date and end date parameters are required');
        }

        const result = await reportService.generateComparisonReport(
            req.params.userId,
            startDate,
            endDate
        );

        if (!result.success) {
            return errorResponse(res, 400, result.error);
        }

        return successResponse(res, 200, 'Comparison report generated', result.report);
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};

export const getConsumptionInsights = async (req, res) => {
    try {
        const result = await reportService.getConsumptionInsights(req.params.userId);

        if (!result.success) {
            return errorResponse(res, 400, result.error);
        }

        return successResponse(res, 200, 'Consumption insights retrieved', result.insights);
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};
