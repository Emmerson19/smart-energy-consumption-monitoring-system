import mongoose from 'mongoose';

const thresholdSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
    },
    deviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device',
    },
    thresholdName: {
        type: String,
        required: [true, 'Threshold name is required'],
    },
    thresholdType: {
        type: String,
        enum: ['Daily', 'Weekly', 'Monthly', 'Hourly', 'Custom'],
        required: [true, 'Threshold type is required'],
    },
    maxValue: {
        type: Number,
        required: [true, 'Max value is required'],
        description: 'Maximum energy consumption allowed in kWh',
    },
    minValue: {
        type: Number,
        default: 0,
        description: 'Minimum energy consumption in kWh',
    },
    alertWhen: {
        type: String,
        enum: ['Exceeds', 'Below', 'Between', 'Outside'],
        default: 'Exceeds',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    severity: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'High',
    },
    notificationEnabled: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

thresholdSchema.pre('save', async function () {
    this.updatedAt = new Date();
});

const Threshold = mongoose.model('Threshold', thresholdSchema);
export default Threshold;
