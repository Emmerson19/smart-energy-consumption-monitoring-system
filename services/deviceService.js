import Device from '../models/Device.js';
import EnergyConsumption from '../models/EnergyConsumption.js';
import User from '../models/User.js';
import * as auditService from './auditService.js';

export const createDevice = async (userId, deviceData) => {
    try {
        const device = new Device({
            userId,
            ...deviceData
        });
        
        await device.save();
        await User.findByIdAndUpdate(userId, {
            $inc: { deviceCount: 1 },
            updatedAt: new Date()
        });
        await auditService.logAction(userId, 'Create Device', device._id, {
            name: device.deviceName,
            type: device.deviceType,
            location: device.location
        });
        return { success: true, device };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const getDevicesByUser = async (userId, limit = 10, page = 1) => {
    try {
        const skip = (page - 1) * limit;
        const devices = await Device.find({ userId })
            .limit(limit)
            .skip(skip)
            .sort({ createdAt: -1 });
        
        const total = await Device.countDocuments({ userId });
        
        return { 
            success: true, 
            devices, 
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

export const getDeviceById = async (deviceId) => {
    try {
        const device = await Device.findById(deviceId);
        if (!device) {
            return { success: false, error: 'Device not found' };
        }
        return { success: true, device };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const updateDevice = async (deviceId, updateData) => {
    try {
        const device = await Device.findByIdAndUpdate(
            deviceId,
            { ...updateData, updatedAt: new Date() },
            { new: true, runValidators: true }
        );
        
        if (!device) {
            return { success: false, error: 'Device not found' };
        }
        return { success: true, device };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const deleteDevice = async (deviceId) => {
    try {
        // Delete all consumption data for this device
        await EnergyConsumption.deleteMany({ deviceId });
        
        // Delete the device
        const device = await Device.findByIdAndDelete(deviceId);
        
        if (!device) {
            return { success: false, error: 'Device not found' };
        }

        await User.findByIdAndUpdate(device.userId, {
            $inc: { deviceCount: -1 },
            updatedAt: new Date()
        });
        await auditService.logAction(device.userId, 'Delete Device', device._id, {
            name: device.deviceName,
            deviceId: device.deviceId
        });

        return { success: true, message: 'Device deleted successfully' };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const updateDeviceStatus = async (deviceId, status) => {
    try {
        const validStatuses = ['Active', 'Inactive', 'Maintenance', 'Error'];
        if (!validStatuses.includes(status)) {
            return { success: false, error: 'Invalid status' };
        }
        
        const device = await Device.findByIdAndUpdate(
            deviceId,
            { status, updatedAt: new Date() },
            { new: true }
        );
        
        return { success: true, device };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const updateDeviceOnlineStatus = async (deviceId, isOnline) => {
    try {
        const updateData = { isOnline, updatedAt: new Date() };
        if (isOnline) {
            updateData.lastOnlineTime = new Date();
        }
        
        const device = await Device.findByIdAndUpdate(
            deviceId,
            updateData,
            { new: true }
        );
        
        return { success: true, device };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const updateCurrentReading = async (deviceId, reading) => {
    try {
        const device = await Device.findByIdAndUpdate(
            deviceId,
            { currentReading: reading, updatedAt: new Date() },
            { new: true }
        );
        
        return { success: true, device };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const getDeviceStats = async (deviceId) => {
    try {
        const device = await Device.findById(deviceId);
        if (!device) {
            return { success: false, error: 'Device not found' };
        }
        
        const consumptions = await EnergyConsumption.find({ deviceId });
        const totalConsumption = consumptions.reduce((sum, c) => sum + c.consumption, 0);
        const avgConsumption = consumptions.length ? totalConsumption / consumptions.length : 0;
        
        return {
            success: true,
            stats: {
                totalConsumption,
                avgConsumption,
                recordCount: consumptions.length,
                currentReading: device.currentReading,
                status: device.status,
                isOnline: device.isOnline
            }
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
