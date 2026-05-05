import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a user name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false,
    },
    phone: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    household: {
        location: {
            type: String,
            trim: true,
        },
        occupants: {
            type: Number,
            default: 1,
            min: [1, 'Must have at least one occupant']
        },
        mainAppliances: {
            type: [String],
            default: []
        }
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    profileImage: {
        type: String,
        default: null,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    deviceCount: {
        type: Number,
        default: 0,
    },
    totalEnergyUsed: {
        type: Number,
        default: 0,
        description: 'Total energy used in kWh'
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

userSchema.pre('save', async function () {
    this.updatedAt = new Date();
});

const User = mongoose.model('User', userSchema);
export default User;
