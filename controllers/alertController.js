import * as alertService from '../services/alertService.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/responseFormatter.js';

export const createThreshold = async (req, res) => {
    try {
        const { thresholdName, thresholdType, maxValue } = req.body;

        if (!thresholdName || !thresholdType || !maxValue) {
            return errorResponse(res, 400, 'Missing required fields');
        }

        const result = await alertService.createThreshold(req.params.userId, req.body);

        if (!result.success) {
            return errorResponse(res, 400, result.error);
        }

        return successResponse(res, 201, 'Threshold created successfully', result.threshold);
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};

export const getThresholds = async (req, res) => {
    try {
        const result = await alertService.getThresholds(req.params.userId);

        if (!result.success) {
            return errorResponse(res, 400, result.error);
        }

        return successResponse(res, 200, 'Thresholds retrieved successfully', result.thresholds);
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};

export const updateThreshold = async (req, res) => {
    try {
        const result = await alertService.updateThreshold(req.params.thresholdId, req.body);

        if (!result.success) {
            return errorResponse(res, 400, result.error);
        }

        return successResponse(res, 200, 'Threshold updated successfully', result.threshold);
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};

export const deleteThreshold = async (req, res) => {
    try {
        const result = await alertService.deleteThreshold(req.params.thresholdId);

        if (!result.success) {
            return errorResponse(res, 404, result.error);
        }

        return successResponse(res, 200, result.message);
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};

export const createAlert = async (req, res) => {
    try {
        const { deviceId, alertType, title, description } = req.body;

        if (!deviceId || !alertType || !title) {
            return errorResponse(res, 400, 'Missing required fields');
        }

        const result = await alertService.createAlert(req.params.userId, req.body);

        if (!result.success) {
            return errorResponse(res, 400, result.error);
        }

        return successResponse(res, 201, 'Alert created successfully', result.alert);
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};

export const getAlerts = async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 50, 200);
        const page = parseInt(req.query.page) || 1;
        const isResolved = req.query.isResolved === 'true' ? true : req.query.isResolved === 'false' ? false : null;

        const result = await alertService.getAlerts(req.params.userId, isResolved, limit, page);

        if (!result.success) {
            return errorResponse(res, 400, result.error);
        }

        return paginatedResponse(
            res,
            200,
            'Alerts retrieved successfully',
            result.alerts,
            result.pagination.page,
            limit,
            result.pagination.total
        );
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};

export const getAlertsByDevice = async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 50, 200);
        const page = parseInt(req.query.page) || 1;

        const result = await alertService.getAlertsByDevice(req.params.deviceId, limit, page);

        if (!result.success) {
            return errorResponse(res, 400, result.error);
        }

        return paginatedResponse(
            res,
            200,
            'Device alerts retrieved successfully',
            result.alerts,
            result.pagination.page,
            limit,
            result.pagination.total
        );
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};

export const resolveAlert = async (req, res) => {
    try {
        const { resolutionNotes } = req.body;

        const result = await alertService.resolveAlert(
            req.params.alertId,
            req.userId,
            resolutionNotes
        );

        if (!result.success) {
            return errorResponse(res, 404, result.error);
        }

        return successResponse(res, 200, 'Alert resolved successfully', result.alert);
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};

export const getUnresolvedAlerts = async (req, res) => {
    try {
        const result = await alertService.getUnresolvedAlerts(req.params.userId);

        if (!result.success) {
            return errorResponse(res, 400, result.error);
        }

        return successResponse(res, 200, 'Unresolved alerts retrieved', {
            alerts: result.alerts,
            count: result.count
        });
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};

export const getAlertStats = async (req, res) => {
    try {
        const result = await alertService.getAlertStats(req.params.userId);

        if (!result.success) {
            return errorResponse(res, 400, result.error);
        }

        return successResponse(res, 200, 'Alert statistics retrieved', result.stats);
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};
