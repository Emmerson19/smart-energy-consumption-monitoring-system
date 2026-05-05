import mongoose from 'mongoose';

const energyConsumptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
    },
    deviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device',
        required: [true, 'Device ID is required'],
    },
    consumption: {
        type: Number,
        required: [true, 'Consumption value is required'],
        description: 'Energy consumption in kWh',
    },
    voltage: {
        type: Number,
        description: 'Voltage in volts',
    },
    current: {
        type: Number,
        description: 'Current in amperes',
    },
    powerFactor: {
        type: Number,
        min: 0,
        max: 1,
        description: 'Power factor value',
    },
    cost: {
        type: Number,
        description: 'Cost of energy consumed',
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    period: {
        type: String,
        enum: ['Hourly', 'Daily', 'Weekly', 'Monthly'],
        default: 'Hourly',
    },
    temperature: {
        type: Number,
        description: 'Temperature during consumption',
    },
    humidity: {
        type: Number,
        description: 'Humidity percentage',
    },
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now,
        index: true,
    },
});

// Create compound index for efficient querying
energyConsumptionSchema.index({ userId: 1, deviceId: 1, createdAt: -1 });
energyConsumptionSchema.index({ userId: 1, createdAt: -1 });

const EnergyConsumption = mongoose.model('EnergyConsumption', energyConsumptionSchema);
export default EnergyConsumption;
