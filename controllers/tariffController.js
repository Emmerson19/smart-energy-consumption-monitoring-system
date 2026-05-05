import * as tariffService from '../services/tariffService.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/responseFormatter.js';

export const createTariff = async (req, res) => {
    try {
        const tariff = await tariffService.createTariff(req.body);
        return successResponse(res, 201, 'Tariff created successfully', tariff);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getCurrentTariff = async (req, res) => {
    try {
        const tariff = await tariffService.getActiveTariff();
        return successResponse(res, 200, 'Active tariff retrieved', tariff);
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};

export const listTariffs = async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 50, 100);
        const page = parseInt(req.query.page) || 1;
        const result = await tariffService.listTariffs(limit, page);
        return paginatedResponse(res, 200, 'Tariffs retrieved', result.tariffs, page, limit, result.pagination.total);
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};

export const updateTariff = async (req, res) => {
    try {
        const tariff = await tariffService.updateTariff(req.params.tariffId, req.body);
        return successResponse(res, 200, 'Tariff updated successfully', tariff);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};
