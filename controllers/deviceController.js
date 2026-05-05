import * as deviceService from '../services/deviceService.js';
import { successResponse, errorResponse } from '../utils/responseFormatter.js';
import { paginatedResponse } from '../utils/responseFormatter.js';

export const createDevice = async (req, res) => {
    try {
        const { deviceName, deviceId, deviceType, location, installationDate } = req.body;

        if (!deviceName || !deviceId || !deviceType || !location || !installationDate) {
            return errorResponse(res, 400, 'Missing required fields');
        }

        const result = await deviceService.createDevice(req.params.userId, req.body);

        if (!result.success) {
            return errorResponse(res, 400, result.error);
        }

        return successResponse(res, 201, 'Device created successfully', result.device);
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};

export const getDevices = async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 10, 100);
        const page = parseInt(req.query.page) || 1;

        const result = await deviceService.getDevicesByUser(req.params.userId, limit, page);

        if (!result.success) {
            return errorResponse(res, 400, result.error);
        }

        return paginatedResponse(
            res,
            200,
            'Devices retrieved successfully',
            result.devices,
            result.pagination.page,
            limit,
            result.pagination.total
        );
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};

export const getDevice = async (req, res) => {
    try {
        const result = await deviceService.getDeviceById(req.params.deviceId);

        if (!result.success) {
            return errorResponse(res, 404, result.error);
        }

        return successResponse(res, 200, 'Device retrieved successfully', result.device);
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};

export const updateDevice = async (req, res) => {
    try {
        const result = await deviceService.updateDevice(req.params.deviceId, req.body);

        if (!result.success) {
            return errorResponse(res, 400, result.error);
        }

        return successResponse(res, 200, 'Device updated successfully', result.device);
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};

export const deleteDevice = async (req, res) => {
    try {
        const result = await deviceService.deleteDevice(req.params.deviceId);

        if (!result.success) {
            return errorResponse(res, 404, result.error);
        }

        return successResponse(res, 200, result.message);
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};

export const updateDeviceStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return errorResponse(res, 400, 'Status is required');
        }

        const result = await deviceService.updateDeviceStatus(req.params.deviceId, status);

        if (!result.success) {
            return errorResponse(res, 400, result.error);
        }

        return successResponse(res, 200, 'Device status updated', result.device);
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};

export const updateDeviceOnlineStatus = async (req, res) => {
    try {
        const { isOnline } = req.body;

        if (isOnline === undefined) {
            return errorResponse(res, 400, 'isOnline parameter is required');
        }

        const result = await deviceService.updateDeviceOnlineStatus(req.params.deviceId, isOnline);

        if (!result.success) {
            return errorResponse(res, 400, result.error);
        }

        return successResponse(res, 200, 'Device online status updated', result.device);
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};

export const getDeviceStats = async (req, res) => {
    try {
        const result = await deviceService.getDeviceStats(req.params.deviceId);

        if (!result.success) {
            return errorResponse(res, 404, result.error);
        }

        return successResponse(res, 200, 'Device statistics retrieved', result.stats);
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};
