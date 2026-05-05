import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
    },
    deviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device',
        required: true,
    },
    alertType: {
        type: String,
        enum: [
            'HighConsumption',
            'LowBattery',
            'DeviceOffline',
            'BudgetExceeded',
            'AbnormalUsage',
            'VoltageVariation',
            'Maintenance',
            'Custom',
        ],
        required: [true, 'Alert type is required'],
    },
    title: {
        type: String,
        required: [true, 'Alert title is required'],
    },
    description: String,
    severity: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium',
    },
    threshold: Number,
    currentValue: Number,
    isResolved: {
        type: Boolean,
        default: false,
    },
    resolvedAt: Date,
    resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    resolutionNotes: String,
    isNotified: {
        type: Boolean,
        default: false,
    },
    notificationChannels: {
        type: [String],
        enum: ['Email', 'SMS', 'InApp', 'Push'],
        default: ['Email', 'InApp'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

alertSchema.pre('save', async function () {
    this.updatedAt = new Date();
});

alertSchema.index({ userId: 1, isResolved: 1, createdAt: -1 });

const Alert = mongoose.model('Alert', alertSchema);
export default Alert;
