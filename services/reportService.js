import EnergyConsumption from '../models/EnergyConsumption.js';
import Device from '../models/Device.js';
import User from '../models/User.js';
import * as tariffService from './tariffService.js';

const getUserById = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

export const generateDailyReport = async (userId, date) => {
    try {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        
        const consumptions = await EnergyConsumption.find({
            userId,
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ createdAt: 1 });
        
        const user = await getUserById(userId);
        const devices = await Device.find({ userId });
        
        const totalConsumption = consumptions.reduce((sum, c) => sum + c.consumption, 0);
        const avgConsumption = consumptions.length ? totalConsumption / consumptions.length : 0;
        const maxConsumption = consumptions.length ? Math.max(...consumptions.map(c => c.consumption)) : 0;
        const minConsumption = consumptions.length ? Math.min(...consumptions.map(c => c.consumption)) : 0;
        
        return {
            success: true,
            report: {
                reportType: 'Daily',
                date: date.toISOString().split('T')[0],
                user: {
                    name: user.name,
                    email: user.email
                },
                summary: {
                    totalConsumption,
                    averageConsumption: avgConsumption.toFixed(2),
                    maxConsumption,
                    minConsumption,
                    activeDevices: devices.filter(d => d.status === 'Active').length,
                    totalDevices: devices.length
                },
                consumptions: consumptions.map(c => ({
                    timestamp: c.timestamp,
                    consumption: c.consumption,
                    cost: c.cost
                })),
                generatedAt: new Date()
            }
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const generateMonthlyReport = async (userId, year, month) => {
    try {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);
        
        const consumptions = await EnergyConsumption.find({
            userId,
            createdAt: { $gte: startDate, $lte: endDate }
        }).sort({ createdAt: 1 });
        
        const user = await getUserById(userId);
        
        const totalConsumption = consumptions.reduce((sum, c) => sum + c.consumption, 0);
        const totalCost = consumptions.reduce((sum, c) => sum + (c.cost || 0), 0);
        const avgDailyConsumption = totalConsumption / 30;
        
        // Group by day
        const dailyBreakdown = {};
        consumptions.forEach(c => {
            const date = new Date(c.createdAt).toISOString().split('T')[0];
            if (!dailyBreakdown[date]) {
                dailyBreakdown[date] = { consumption: 0, cost: 0 };
            }
            dailyBreakdown[date].consumption += c.consumption;
            dailyBreakdown[date].cost += c.cost || 0;
        });
        
        return {
            success: true,
            report: {
                reportType: 'Monthly',
                year,
                month,
                user: {
                    name: user.name,
                    email: user.email
                },
                summary: {
                    totalConsumption: totalConsumption.toFixed(2),
                    totalCost: totalCost.toFixed(2),
                    averageDailyConsumption: avgDailyConsumption.toFixed(2),
                    peakDay: Object.entries(dailyBreakdown).reduce((max, [date, data]) =>
                        data.consumption > max.consumption ? { date, ...data } : max,
                        { date: null, consumption: 0 }
                    ),
                    recordCount: consumptions.length
                },
                dailyBreakdown,
                generatedAt: new Date()
            }
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const generateYearlyReport = async (userId, year) => {
    try {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59);
        
        const consumptions = await EnergyConsumption.find({
            userId,
            createdAt: { $gte: startDate, $lte: endDate }
        }).sort({ createdAt: 1 });
        
        const user = await getUserById(userId);
        
        const totalConsumption = consumptions.reduce((sum, c) => sum + c.consumption, 0);
        const totalCost = consumptions.reduce((sum, c) => sum + (c.cost || 0), 0);
        
        // Group by month
        const monthlyBreakdown = {};
        for (let i = 0; i < 12; i++) {
            monthlyBreakdown[i + 1] = { consumption: 0, cost: 0 };
        }
        
        consumptions.forEach(c => {
            const month = new Date(c.createdAt).getMonth() + 1;
            monthlyBreakdown[month].consumption += c.consumption;
            monthlyBreakdown[month].cost += c.cost || 0;
        });
        
        return {
            success: true,
            report: {
                reportType: 'Yearly',
                year,
                user: {
                    name: user.name,
                    email: user.email
                },
                summary: {
                    totalConsumption: totalConsumption.toFixed(2),
                    totalCost: totalCost.toFixed(2),
                    averageMonthlyConsumption: (totalConsumption / 12).toFixed(2),
                    recordCount: consumptions.length
                },
                monthlyBreakdown,
                generatedAt: new Date()
            }
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const generateComparisonReport = async (userId, startDate, endDate) => {
    try {
        const consumptions = await EnergyConsumption.find({
            userId,
            createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        });
        
        const monthBefore = new Date(startDate);
        monthBefore.setMonth(monthBefore.getMonth() - 1);
        const lastMonth = new Date(startDate);
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        
        const previousConsumptions = await EnergyConsumption.find({
            userId,
            createdAt: { 
                $gte: lastMonth,
                $lt: new Date(startDate)
            }
        });
        
        const currentTotal = consumptions.reduce((sum, c) => sum + c.consumption, 0);
        const previousTotal = previousConsumptions.reduce((sum, c) => sum + c.consumption, 0);
        const change = ((currentTotal - previousTotal) / previousTotal * 100).toFixed(2);
        
        return {
            success: true,
            report: {
                reportType: 'Comparison',
                period: {
                    current: { start: startDate, end: endDate },
                    previous: `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`
                },
                summary: {
                    currentConsumption: currentTotal.toFixed(2),
                    previousConsumption: previousTotal.toFixed(2),
                    changePercentage: change,
                    trend: parseFloat(change) > 0 ? 'Increase' : 'Decrease'
                },
                generatedAt: new Date()
            }
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const getConsumptionInsights = async (userId) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const consumptions = await EnergyConsumption.find({
            userId,
            createdAt: { $gte: thirtyDaysAgo }
        }).sort({ createdAt: -1 });
        
        const totalConsumption = consumptions.reduce((sum, c) => sum + c.consumption, 0);
        const avgConsumption = consumptions.length ? totalConsumption / consumptions.length : 0;
        
        // Find peak usage time
        const hourlyConsumption = {};
        consumptions.forEach(c => {
            const hour = new Date(c.createdAt).getHours();
            hourlyConsumption[hour] = (hourlyConsumption[hour] || 0) + c.consumption;
        });
        
        const peakHour = Object.entries(hourlyConsumption).reduce((max, [hour, consumption]) =>
            consumption > max.consumption ? { hour, consumption } : max,
            { hour: 0, consumption: 0 }
        );

        const tariff = await tariffService.getActiveTariff();
        const estimatedCost = totalConsumption * (tariff?.ratePerKWh || 0);
        const anomalies = detectAnomalies(consumptions, avgConsumption);
        
        return {
            success: true,
            insights: {
                period: '30 days',
                totalConsumption: totalConsumption.toFixed(2),
                averageDaily: (totalConsumption / 30).toFixed(2),
                peakHour: peakHour.hour,
                peakConsumption: peakHour.consumption?.toFixed(2),
                estimatedCost: estimatedCost.toFixed(2),
                currency: tariff?.currency || 'USD',
                anomalies,
                recommendations: generateRecommendations(totalConsumption, avgConsumption, anomalies)
            }
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

const detectAnomalies = (consumptions, avgConsumption) => {
    if (!consumptions.length) return [];

    const recentConsumption = consumptions.slice(0, 7);
    const anomalies = recentConsumption
        .filter((c) => c.consumption > avgConsumption * 1.75)
        .map((c) => ({
            date: new Date(c.createdAt).toISOString().split('T')[0],
            consumption: c.consumption,
            message: 'Unusual spike detected'
        }));

    return anomalies;
};

const generateRecommendations = (totalConsumption, avgConsumption, anomalies = []) => {
    const recommendations = [];
    
    if (totalConsumption > 500) {
        recommendations.push('Consider reducing peak hour usage for cost savings');
    }
    
    if (avgConsumption > 50) {
        recommendations.push('Check for energy-consuming appliances');
    }

    if (anomalies.length) {
        recommendations.push('Review recent spikes and check for device or meter issues');
    }
    
    recommendations.push('Monitor consumption trends weekly');
    recommendations.push('Consider energy-efficient alternatives');
    
    return recommendations;
};
