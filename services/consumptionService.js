import EnergyConsumption from '../models/EnergyConsumption.js';
import Device from '../models/Device.js';
import User from '../models/User.js';
import * as tariffService from './tariffService.js';
import * as alertService from './alertService.js';
import * as auditService from './auditService.js';

export const recordConsumption = async (userId, deviceId, consumptionData) => {
    try {
        // Verify device exists
        const device = await Device.findById(deviceId);
        if (!device) {
            return { success: false, error: 'Device not found' };
        }

        const tariff = await tariffService.getActiveTariff();
        const calculatedCost = consumptionData.cost !== undefined && consumptionData.cost !== null
            ? consumptionData.cost
            : (consumptionData.consumption || 0) * (tariff?.ratePerKWh || 0);

        const consumption = new EnergyConsumption({
            userId,
            deviceId,
            ...consumptionData,
            cost: calculatedCost
        });
        
        await consumption.save();
        
        // Update device's current reading
        await Device.findByIdAndUpdate(deviceId, {
            currentReading: consumptionData.consumption,
            updatedAt: new Date()
        });

        // Update user energy totals
        await User.findByIdAndUpdate(userId, {
            $inc: { totalEnergyUsed: consumptionData.consumption || 0 },
            updatedAt: new Date()
        });

        // Log the consumption action for audit trail
        await auditService.logAction(userId, 'Record Consumption', deviceId, {
            consumption: consumptionData.consumption,
            cost: calculatedCost,
            period: consumptionData.period
        });

        // Create alerts for any matching thresholds
        const threshold = await alertService.getThresholds(userId)
            .then((result) => result.success ? result.thresholds.find(t => !t.deviceId || t.deviceId.toString() === deviceId.toString()) : null);

        await alertService.checkAndCreateAlerts(userId, deviceId, consumptionData.consumption || 0, threshold);
        
        return { success: true, consumption };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const getConsumptionByDevice = async (deviceId, startDate, endDate, limit = 100, page = 1) => {
    try {
        const skip = (page - 1) * limit;
        const query = { deviceId };
        
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        
        const consumptions = await EnergyConsumption.find(query)
            .limit(limit)
            .skip(skip)
            .sort({ createdAt: -1 });
        
        const total = await EnergyConsumption.countDocuments(query);
        
        return {
            success: true,
            consumptions,
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

export const getConsumptionByUser = async (userId, startDate, endDate, limit = 100, page = 1) => {
    try {
        const skip = (page - 1) * limit;
        const query = { userId };
        
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        
        const consumptions = await EnergyConsumption.find(query)
            .limit(limit)
            .skip(skip)
            .sort({ createdAt: -1 });
        
        const total = await EnergyConsumption.countDocuments(query);
        
        return {
            success: true,
            consumptions,
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

export const getDailyConsumption = async (userId, date) => {
    try {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        
        const consumptions = await EnergyConsumption.find({
            userId,
            createdAt: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        }).sort({ createdAt: 1 });
        
        const totalConsumption = consumptions.reduce((sum, c) => sum + c.consumption, 0);
        
        return {
            success: true,
            date: date.toISOString().split('T')[0],
            totalConsumption,
            consumptions,
            count: consumptions.length
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const getMonthlyConsumption = async (userId, year, month) => {
    try {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);
        
        const consumptions = await EnergyConsumption.find({
            userId,
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        }).sort({ createdAt: 1 });
        
        const totalConsumption = consumptions.reduce((sum, c) => sum + c.consumption, 0);
        
        return {
            success: true,
            year,
            month,
            totalConsumption,
            consumptions,
            count: consumptions.length
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const getHourlyConsumption = async (userId, date) => {
    try {
        const consumptions = await EnergyConsumption.find({
            userId,
            createdAt: {
                $gte: new Date(date),
                $lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000)
            }
        }).sort({ createdAt: 1 });
        
        // Group by hour
        const hourlyData = {};
        consumptions.forEach(c => {
            const hour = new Date(c.createdAt).getHours();
            if (!hourlyData[hour]) {
                hourlyData[hour] = [];
            }
            hourlyData[hour].push(c);
        });
        
        return {
            success: true,
            date: new Date(date).toISOString().split('T')[0],
            hourlyData
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const getConsumptionTrend = async (userId, days = 30) => {
    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        
        const consumptions = await EnergyConsumption.find({
            userId,
            createdAt: { $gte: startDate }
        }).sort({ createdAt: 1 });
        
        // Group by date
        const trendData = {};
        consumptions.forEach(c => {
            const date = new Date(c.createdAt).toISOString().split('T')[0];
            if (!trendData[date]) {
                trendData[date] = { date, consumption: 0, count: 0 };
            }
            trendData[date].consumption += c.consumption;
            trendData[date].count += 1;
        });
        
        return {
            success: true,
            days,
            trendData: Object.values(trendData)
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const getDeviceComparison = async (userId) => {
    try {
        const devices = await Device.find({ userId });
        const comparison = [];
        
        for (const device of devices) {
            const consumptions = await EnergyConsumption.find({
                deviceId: device._id
            });
            
            const totalConsumption = consumptions.reduce((sum, c) => sum + c.consumption, 0);
            const avgConsumption = consumptions.length ? totalConsumption / consumptions.length : 0;
            
            comparison.push({
                deviceId: device._id,
                deviceName: device.deviceName,
                totalConsumption,
                avgConsumption,
                recordCount: consumptions.length
            });
        }
        
        return {
            success: true,
            comparison: comparison.sort((a, b) => b.totalConsumption - a.totalConsumption)
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
