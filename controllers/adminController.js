import * as adminService from '../services/adminService.js';
import * as auditService from '../services/auditService.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/responseFormatter.js';

export const exportBackup = async (req, res) => {
    try {
        const backup = await adminService.exportBackup();
        return successResponse(res, 200, 'Backup exported successfully', backup);
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};

export const restoreBackup = async (req, res) => {
    try {
        const result = await adminService.restoreBackup(req.body);
        return successResponse(res, 200, 'Backup restored successfully', result);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getAuditLogs = async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 50, 100);
        const page = parseInt(req.query.page) || 1;
        const result = await auditService.getAuditLogs(limit, page);
        return paginatedResponse(res, 200, 'Audit logs retrieved', result.logs, page, limit, result.pagination.total);
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};
