import AuditLog from '../models/AuditLog.js';

export const logAction = async (userId, action, targetId = null, details = null, source = 'API') => {
    try {
        const audit = new AuditLog({ userId, action, targetId, details, source });
        await audit.save();
        return audit;
    } catch (err) {
        console.error('Audit log failed:', err.message);
        return null;
    }
};

export const getAuditLogs = async (limit = 50, page = 1) => {
    const skip = (page - 1) * limit;
    const logs = await AuditLog.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);
    const total = await AuditLog.countDocuments();
    return { logs, pagination: { total, page, pages: Math.ceil(total / limit) } };
};
