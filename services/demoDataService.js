import Device from '../models/Device.js';
import EnergyConsumption from '../models/EnergyConsumption.js';
import Alert from '../models/Alert.js';

/**
 * Generate sample energy consumption data for demonstration
 * @param {string} userId - The user ID
 * @returns {Array} Array of demo consumption records with powerWatts and status
 */
const generateDemoConsumptionData = (userId, deviceIds) => {
    const now = new Date();
    const demoData = [];
    const HIGH_POWER_THRESHOLD = 1000; // Watts

    // Sample devices with realistic power consumption patterns
    const sampleRecords = [
        {
            deviceName: 'Living Room AC',
            deviceType: 'Smart Plug',
            records: [
                { hours: -24, consumption: 3.5, powerWatts: 1850 }, // High consumption
                { hours: -20, consumption: 3.8, powerWatts: 1950 }, // High consumption
                { hours: -16, consumption: 3.2, powerWatts: 1680 }, // High consumption
                { hours: -12, consumption: 2.1, powerWatts: 1200 }  // High consumption
            ]
        },
        {
            deviceName: 'Kitchen Refrigerator',
            deviceType: 'Smart Plug',
            records: [
                { hours: -23, consumption: 0.8, powerWatts: 450 },
                { hours: -19, consumption: 0.9, powerWatts: 500 },
                { hours: -15, consumption: 0.85, powerWatts: 480 },
                { hours: -11, consumption: 0.7, powerWatts: 380 }
            ]
        },
        {
            deviceName: 'Water Heater',
            deviceType: 'Meter',
            records: [
                { hours: -22, consumption: 2.5, powerWatts: 1300 }, // High consumption
                { hours: -18, consumption: 2.3, powerWatts: 1250 }, // High consumption
                { hours: -14, consumption: 1.8, powerWatts: 950 },
                { hours: -10, consumption: 2.0, powerWatts: 1100 }  // High consumption
            ]
        },
        {
            deviceName: 'Bedroom Lights & Fan',
            deviceType: 'Smart Plug',
            records: [
                { hours: -21, consumption: 0.4, powerWatts: 120 },
                { hours: -17, consumption: 0.35, powerWatts: 100 },
                { hours: -13, consumption: 0.3, powerWatts: 85 },
                { hours: -9, consumption: 0.25, powerWatts: 75 }
            ]
        },
        {
            deviceName: 'Washing Machine',
            deviceType: 'Smart Plug',
            records: [
                { hours: -6, consumption: 1.2, powerWatts: 800 },
                { hours: -5, consumption: 1.5, powerWatts: 1600 }, // High consumption
                { hours: -4, consumption: 0.3, powerWatts: 250 },
                { hours: -3, consumption: 2.8, powerWatts: 1900 }   // High consumption
            ]
        }
    ];

    // Create records for each sample device
    sampleRecords.forEach((sample, index) => {
        const deviceId = deviceIds && deviceIds[index] ? deviceIds[index] : null;
        
        if (deviceId) {
            sample.records.forEach((record) => {
                const recordTime = new Date(now.getTime() + record.hours * 60 * 60 * 1000);
                const powerWatts = record.powerWatts;
                const status = powerWatts > HIGH_POWER_THRESHOLD ? 'high' : 'normal';
                
                demoData.push({
                    userId,
                    deviceId,
                    consumption: record.consumption,
                    powerWatts: powerWatts,
                    status: status,
                    voltage: 230 + Math.random() * 10 - 5,
                    current: (powerWatts / 230) + Math.random() * 2 - 1,
                    powerFactor: 0.95 + Math.random() * 0.05,
                    cost: record.consumption * 8.5, // Example rate: ₱8.50/kWh
                    timestamp: recordTime,
                    period: 'Hourly',
                    temperature: 26 + Math.random() * 4,
                    humidity: 60 + Math.random() * 20
                });
            });
        }
    });

    return demoData;


/**
 * Create sample devices for a user
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} Array of created device IDs
 */
export const createSampleDevices = async (userId) => {
    try {
        const devices = [
            {
                userId,
                deviceName: 'Living Room AC',
                deviceId: `DEVICE-AC-${Date.now()}-001`,
                deviceType: 'Smart Plug',
                location: 'Living Room',
                manufacturer: 'LG',
                model: 'Smart AC 2000',
                serialNumber: 'LG-AC-001',
                installationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                status: 'Active'
            },
            {
                userId,
                deviceName: 'Kitchen Refrigerator',
                deviceId: `DEVICE-REF-${Date.now()}-002`,
                deviceType: 'Smart Plug',
                location: 'Kitchen',
                manufacturer: 'Samsung',
                model: 'Smart Fridge Pro',
                serialNumber: 'SAM-REF-002',
                installationDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
                status: 'Active'
            },
            {
                userId,
                deviceName: 'Water Heater',
                deviceId: `DEVICE-WH-${Date.now()}-003`,
                deviceType: 'Meter',
                location: 'Utility Room',
                manufacturer: 'Ariston',
                model: 'Smart Water Heater',
                serialNumber: 'ARI-WH-003',
                installationDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
                status: 'Active'
            },
            {
                userId,
                deviceName: 'Bedroom Lights & Fan',
                deviceId: `DEVICE-FAN-${Date.now()}-004`,
                deviceType: 'Smart Plug',
                location: 'Bedroom',
                manufacturer: 'Philips',
                model: 'Smart Light & Fan',
                serialNumber: 'PHI-FAN-004',
                installationDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
                status: 'Active'
            },
            {
                userId,
                deviceName: 'Washing Machine',
                deviceId: `DEVICE-WM-${Date.now()}-005`,
                deviceType: 'Smart Plug',
                location: 'Laundry Room',
                manufacturer: 'Bosch',
                model: 'Smart Washing Machine',
                serialNumber: 'BOSCH-WM-005',
                installationDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
                status: 'Active'
            }
        ];

        const createdDevices = await Device.insertMany(devices);
        return createdDevices.map((device) => device._id);
    } catch (error) {
        console.error('Error creating sample devices:', error);
        throw error;
    }
};

/**
 * Seed demo consumption data for a user
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} Result object with success status and created records count
 */
export const seedDemoConsumptionData = async (userId) => {
    try {
        // Check if demo data already exists for this user
        const existingRecords = await EnergyConsumption.countDocuments({ userId });
        if (existingRecords > 0) {
            return {
                success: true,
                message: 'Demo data already exists for this user',
                created: 0,
                existing: existingRecords,
                alerts: 0
            };
        }

        // Create sample devices
        const deviceIds = await createSampleDevices(userId);

        // Generate and insert demo consumption data
        const demoData = generateDemoConsumptionData(userId, deviceIds);
        const createdRecords = await EnergyConsumption.insertMany(demoData);

        // Generate alerts for high consumption
        const alerts = await createHighConsumptionAlerts(userId, createdRecords, deviceIds);

        return {
            success: true,
            message: 'Demo data seeded successfully',
            created: createdRecords.length,
            devices: deviceIds.length,
            records: createdRecords,
            alerts: alerts.length,
            alertDetails: alerts
        };
    } catch (error) {
        console.error('Error seeding demo data:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Generate alerts for high power consumption records
 * @param {string} userId - The user ID
 * @param {Array} consumptionRecords - Created consumption records
 * @param {Array} deviceIds - Device IDs
 * @returns {Promise<Array>} Array of created alerts
 */
const createHighConsumptionAlerts = async (userId, consumptionRecords, deviceIds) => {
    const HIGH_POWER_THRESHOLD = 1000; // Watts
    const alerts = [];

    // Map deviceIds to records for easier lookup
    const deviceMap = {};
    consumptionRecords.forEach((record) => {
        if (!deviceMap[record.deviceId]) {
            deviceMap[record.deviceId] = [];
        }
        deviceMap[record.deviceId].push(record);
    });

    // Create alerts for high consumption records
    const highConsumptionRecords = consumptionRecords.filter(r => r.powerWatts > HIGH_POWER_THRESHOLD);

    for (const record of highConsumptionRecords) {
        const alertData = {
            userId,
            deviceId: record.deviceId,
            alertType: 'HighConsumption',
            title: 'High Energy Consumption Detected',
            description: `Device consuming ${record.powerWatts}W exceeds threshold of ${HIGH_POWER_THRESHOLD}W. Energy usage: ${record.consumption} kWh.`,
            severity: record.powerWatts > 1500 ? 'High' : 'Medium',
            threshold: HIGH_POWER_THRESHOLD,
            currentValue: record.powerWatts,
            isResolved: false,
            isNotified: true,
            notificationChannels: ['InApp', 'Email']
        };

        try {
            const alert = await Alert.create(alertData);
            alerts.push(alert);
        } catch (error) {
            console.error('Error creating alert:', error);
        }
    }

    return alerts;
};

/**
 * Clear demo data for a user (for testing)
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} Result object with success status and deleted count
 */
export const clearDemoData = async (userId) => {
    try {
        // Delete all consumption records for this user
        const consumptionResult = await EnergyConsumption.deleteMany({ userId });

        // Delete all devices for this user
        const deviceResult = await Device.deleteMany({ userId });

        // Delete all high consumption alerts for this user
        const alertResult = await Alert.deleteMany({
            userId,
            alertType: 'HighConsumption'
        });

        return {
            success: true,
            message: 'Demo data cleared successfully',
            consumptionDeleted: consumptionResult.deletedCount,
            devicesDeleted: deviceResult.deletedCount,
            alertsDeleted: alertResult.deletedCount
        };
    } catch (error) {
        console.error('Error clearing demo data:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Get high consumption alerts for a user
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} Array of high consumption alerts
 */
export const getHighConsumptionAlerts = async (userId) => {
    try {
        const alerts = await Alert.find({
            userId,
            alertType: 'HighConsumption',
            isResolved: false
        })
            .populate('deviceId', 'deviceName location')
            .sort({ createdAt: -1 })
            .limit(10);

        return alerts;
    } catch (error) {
        console.error('Error retrieving alerts:', error);
        return [];
    }
};
