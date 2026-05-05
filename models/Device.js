import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
    },
    deviceName: {
        type: String,
        required: [true, 'Device name is required'],
        trim: true,
    },
    deviceId: {
        type: String,
        required: [true, 'Device ID is required'],
        unique: true,
    },
    deviceType: {
        type: String,
        enum: ['Meter', 'Smart Plug', 'Circuit Breaker', 'Solar Panel', 'Battery', 'Other'],
        required: [true, 'Device type is required'],
    },
    location: {
        type: String,
        required: [true, 'Device location is required'],
    },
    manufacturer: String,
    model: String,
    serialNumber: {
        type: String,
    },
    installationDate: {
        type: Date,
        required: [true, 'Installation date is required'],
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Maintenance', 'Error'],
        default: 'Active',
    },
    isOnline: {
        type: Boolean,
        default: true,
    },
    lastOnlineTime: {
        type: Date,
        default: Date.now,
    },
    maxCapacity: {
        type: Number,
        description: 'Maximum capacity in kWh',
    },
    currentReading: {
        type: Number,
        default: 0,
        description: 'Current reading in kWh',
    },
    dailyBudget: {
        type: Number,
        description: 'Daily energy budget in kWh',
    },
    monthlyBudget: {
        type: Number,
        description: 'Monthly energy budget in kWh',
    },
    alertEnabled: {
        type: Boolean,
        default: true,
    },
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

deviceSchema.pre('save', async function () {
    this.updatedAt = new Date();
});

const Device = mongoose.model('Device', deviceSchema);
export default Device;
