import User from '../models/User.js';
import Device from '../models/Device.js';
import EnergyConsumption from '../models/EnergyConsumption.js';
import Threshold from '../models/Threshold.js';
import Alert from '../models/Alert.js';

export const exportBackup = async () => {
    const [users, devices, consumptions, thresholds, alerts] = await Promise.all([
        User.find().lean(),
        Device.find().lean(),
        EnergyConsumption.find().lean(),
        Threshold.find().lean(),
        Alert.find().lean()
    ]);

    return { users, devices, consumptions, thresholds, alerts, generatedAt: new Date() };
};

export const restoreBackup = async (backupData) => {
    if (!backupData) {
        throw new Error('No backup data provided');
    }
    const { users, devices, consumptions, thresholds, alerts } = backupData;

    await Promise.all([
        User.deleteMany({}),
        Device.deleteMany({}),
        EnergyConsumption.deleteMany({}),
        Threshold.deleteMany({}),
        Alert.deleteMany({})
    ]);

    await Promise.all([
        users?.length ? User.insertMany(users) : Promise.resolve(),
        devices?.length ? Device.insertMany(devices) : Promise.resolve(),
        consumptions?.length ? EnergyConsumption.insertMany(consumptions) : Promise.resolve(),
        thresholds?.length ? Threshold.insertMany(thresholds) : Promise.resolve(),
        alerts?.length ? Alert.insertMany(alerts) : Promise.resolve()
    ]);

    return { restoredAt: new Date() };
};
