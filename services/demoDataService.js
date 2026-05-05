import Device from '../models/Device.js';
import EnergyConsumption from '../models/EnergyConsumption.js';

/**
 * Generate sample energy consumption data for demonstration
 * @param {string} userId - The user ID
 * @returns {Array} Array of demo consumption records
 */
const generateDemoConsumptionData = (userId, deviceIds) => {
    const now = new Date();
    const demoData = [];

    // Sample devices and their typical consumption patterns
    const sampleRecords = [
        {
            deviceName: 'Living Room AC',
            deviceType: 'Smart Plug',
            records: [
                { hours: -24, consumption: 3.5, appliance: 'Air Conditioner' },
                { hours: -20, consumption: 3.8, appliance: 'Air Conditioner' },
                { hours: -16, consumption: 3.2, appliance: 'Air Conditioner' },
                { hours: -12, consumption: 2.1, appliance: 'Air Conditioner' }
            ]
        },
        {
            deviceName: 'Kitchen Refrigerator',
            deviceType: 'Smart Plug',
            records: [
                { hours: -23, consumption: 0.8, appliance: 'Refrigerator' },
                { hours: -19, consumption: 0.9, appliance: 'Refrigerator' },
                { hours: -15, consumption: 0.85, appliance: 'Refrigerator' },
                { hours: -11, consumption: 0.7, appliance: 'Refrigerator' }
            ]
        },
        {
            deviceName: 'Water Heater',
            deviceType: 'Meter',
            records: [
                { hours: -22, consumption: 2.5, appliance: 'Water Heater' },
                { hours: -18, consumption: 2.3, appliance: 'Water Heater' },
                { hours: -14, consumption: 1.8, appliance: 'Water Heater' },
                { hours: -10, consumption: 2.0, appliance: 'Water Heater' }
            ]
        },
        {
            deviceName: 'Bedroom Lights & Fan',
            deviceType: 'Smart Plug',
            records: [
                { hours: -21, consumption: 0.4, appliance: 'Ceiling Fan' },
                { hours: -17, consumption: 0.35, appliance: 'Ceiling Fan' },
                { hours: -13, consumption: 0.3, appliance: 'Ceiling Fan' },
                { hours: -9, consumption: 0.25, appliance: 'Ceiling Fan' }
            ]
        },
        {
            deviceName: 'Washing Machine',
            deviceType: 'Smart Plug',
            records: [
                { hours: -6, consumption: 1.2, appliance: 'Washing Machine' },
                { hours: -5, consumption: 1.5, appliance: 'Washing Machine' },
                { hours: -4, consumption: 0.3, appliance: 'Washing Machine' },
                { hours: -3, consumption: 2.8, appliance: 'Washing Machine' }
            ]
        }
    ];

    // Create records for each sample device
    sampleRecords.forEach((sample, index) => {
        const deviceId = deviceIds && deviceIds[index] ? deviceIds[index] : null;
        
        if (deviceId) {
            sample.records.forEach((record) => {
                const recordTime = new Date(now.getTime() + record.hours * 60 * 60 * 1000);
                demoData.push({
                    userId,
                    deviceId,
                    consumption: record.consumption,
                    voltage: 230 + Math.random() * 10 - 5,
                    current: (record.consumption * 1000) / 230 + Math.random() * 2 - 1,
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
};

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
                existing: existingRecords
            };
        }

        // Create sample devices
        const deviceIds = await createSampleDevices(userId);

        // Generate and insert demo consumption data
        const demoData = generateDemoConsumptionData(userId, deviceIds);
        const createdRecords = await EnergyConsumption.insertMany(demoData);

        return {
            success: true,
            message: 'Demo data seeded successfully',
            created: createdRecords.length,
            devices: deviceIds.length,
            records: createdRecords
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

        return {
            success: true,
            message: 'Demo data cleared successfully',
            consumptionDeleted: consumptionResult.deletedCount,
            devicesDeleted: deviceResult.deletedCount
        };
    } catch (error) {
        console.error('Error clearing demo data:', error);
        return {
            success: false,
            error: error.message
        };
    }
};
