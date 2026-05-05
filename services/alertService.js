import Alert from '../models/Alert.js';
import Threshold from '../models/Threshold.js';
import Device from '../models/Device.js';
import * as auditService from './auditService.js';

export const createThreshold = async (userId, thresholdData) => {
    try {
        const threshold = new Threshold({
            userId,
            ...thresholdData
        });
        
        await threshold.save();
        await auditService.logAction(userId, 'Create Threshold', threshold._id, threshold);
        return { success: true, threshold };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const getThresholds = async (userId) => {
    try {
        const thresholds = await Threshold.find({ userId }).sort({ createdAt: -1 });
        return { success: true, thresholds };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const updateThreshold = async (thresholdId, updateData) => {
    try {
        const threshold = await Threshold.findByIdAndUpdate(
            thresholdId,
            { ...updateData, updatedAt: new Date() },
            { new: true, runValidators: true }
        );
        
        if (!threshold) {
            return { success: false, error: 'Threshold not found' };
        }
        return { success: true, threshold };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const deleteThreshold = async (thresholdId) => {
    try {
        const threshold = await Threshold.findByIdAndDelete(thresholdId);
        
        if (!threshold) {
            return { success: false, error: 'Threshold not found' };
        }
        return { success: true, message: 'Threshold deleted successfully' };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const createAlert = async (userId, alertData) => {
    try {
        const alert = new Alert({
            userId,
            ...alertData
        });
        
        await alert.save();
        await auditService.logAction(userId, 'Create Alert', alert._id, alert);
        return { success: true, alert };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const getAlerts = async (userId, isResolved = null, limit = 50, page = 1) => {
    try {
        const skip = (page - 1) * limit;
        const query = { userId };
        
        if (isResolved !== null) {
            query.isResolved = isResolved;
        }
        
        const alerts = await Alert.find(query)
            .limit(limit)
            .skip(skip)
            .sort({ createdAt: -1 });
        
        const total = await Alert.countDocuments(query);
        
        return {
            success: true,
            alerts,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const getAlertsByDevice = async (deviceId, limit = 50, page = 1) => {
    try {
        const skip = (page - 1) * limit;
        
        const alerts = await Alert.find({ deviceId })
            .limit(limit)
            .skip(skip)
            .sort({ createdAt: -1 });
        
        const total = await Alert.countDocuments({ deviceId });
        
        return {
            success: true,
            alerts,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const resolveAlert = async (alertId, userId, resolutionNotes = '') => {
    try {
        const alert = await Alert.findByIdAndUpdate(
            alertId,
            {
                isResolved: true,
                resolvedAt: new Date(),
                resolvedBy: userId,
                resolutionNotes,
                updatedAt: new Date()
            },
            { new: true }
        );
        
        if (!alert) {
            return { success: false, error: 'Alert not found' };
        }
        await auditService.logAction(userId, 'Resolve Alert', alert._id, {
            resolutionNotes,
            alertType: alert.alertType,
            title: alert.title
        });
        return { success: true, alert };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const getUnresolvedAlerts = async (userId) => {
    try {
        const alerts = await Alert.find({
            userId,
            isResolved: false
        }).sort({ createdAt: -1 });
        
        return { success: true, alerts, count: alerts.length };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const getAlertStats = async (userId) => {
    try {
        const totalAlerts = await Alert.countDocuments({ userId });
        const unresolvedAlerts = await Alert.countDocuments({ userId, isResolved: false });
        const criticalAlerts = await Alert.countDocuments({ userId, severity: 'Critical', isResolved: false });
        
        const alertsByType = await Alert.aggregate([
            { $match: { userId: require('mongoose').Types.ObjectId(userId) } },
            { $group: { _id: '$alertType', count: { $sum: 1 } } }
        ]);
        
        return {
            success: true,
            stats: {
                totalAlerts,
                unresolvedAlerts,
                criticalAlerts,
                alertsByType
            }
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const checkAndCreateAlerts = async (userId, deviceId, consumption, threshold = null) => {
    try {
        const device = await Device.findById(deviceId);
        
        if (!device) {
            return { success: false, error: 'Device not found' };
        }

        if (!threshold) {
            threshold = await Threshold.findOne({
                userId,
                isActive: true,
                $or: [
                    { deviceId },
                    { deviceId: { $exists: false } }
                ]
            }).sort({ createdAt: -1 });
        }

        const alerts = [];
        
        if (threshold && threshold.alertWhen === 'Exceeds' && consumption > threshold.maxValue) {
            const alert = await createAlert(userId, {
                deviceId,
                alertType: 'HighConsumption',
                title: `High Energy Consumption on ${device.deviceName}`,
                description: `Consumption of ${consumption} kWh exceeds threshold of ${threshold.maxValue} kWh`,
                severity: threshold.severity,
                threshold: threshold.maxValue,
                currentValue: consumption,
                isResolved: false
            });
            
            if (alert.success) {
                alerts.push(alert.alert);
            }
        }
        
        return { success: true, alerts };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const notifyAlerts = async (alertIds) => {
    try {
        const alerts = await Alert.updateMany(
            { _id: { $in: alertIds } },
            { isNotified: true, updatedAt: new Date() }
        );
        
        return { success: true, updated: alerts.modifiedCount };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
