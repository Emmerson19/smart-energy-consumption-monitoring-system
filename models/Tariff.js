import mongoose from 'mongoose';

const tariffSchema = new mongoose.Schema({
    region: {
        type: String,
        default: 'Default',
        trim: true,
    },
    ratePerKWh: {
        type: Number,
        required: [true, 'Tariff rate is required'],
        min: [0, 'Rate per kWh must be a positive number'],
        default: 0.15,
    },
    currency: {
        type: String,
        default: 'USD',
    },
    description: String,
    isActive: {
        type: Boolean,
        default: true,
    },
    effectiveDate: {
        type: Date,
        default: Date.now,
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

tariffSchema.pre('save', function () {
    this.updatedAt = new Date();
});

const Tariff = mongoose.model('Tariff', tariffSchema);
export default Tariff;
