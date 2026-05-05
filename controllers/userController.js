import User from '../models/User.js';
import * as auditService from '../services/auditService.js';
import { successResponse, errorResponse } from '../utils/responseFormatter.js';
import { validateEmail } from '../utils/validators.js';

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, location, occupants, mainAppliances } = req.body;

        // Validation
        if (!name || !email || !password) {
            return errorResponse(res, 400, 'Name, email, and password are required');
        }

        if (!validateEmail(email)) {
            return errorResponse(res, 400, 'Invalid email format');
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return errorResponse(res, 400, 'User already exists');
        }

        const user = new User({
            name,
            email,
            password,
            phone,
            household: {
                location: location || '',
                occupants: occupants ? Number(occupants) : 1,
                mainAppliances: Array.isArray(mainAppliances)
                    ? mainAppliances
                    : typeof mainAppliances === 'string'
                    ? mainAppliances.split(',').map((item) => item.trim()).filter(Boolean)
                    : []
            }
        });

        await user.save();
        await auditService.logAction(user._id, 'User Registration', user._id, {
            email: user.email,
            household: user.household
        });

        return successResponse(res, 201, 'User registered successfully', {
            userId: user._id,
            email: user.email,
            name: user.name,
            role: user.role
        });
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return errorResponse(res, 400, 'Email and password are required');
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return errorResponse(res, 401, 'Invalid credentials');
        }

        // In production, use bcrypt to compare passwords
        if (user.password !== password) {
            return errorResponse(res, 401, 'Invalid credentials');
        }

        return successResponse(res, 200, 'Login successful', {
            userId: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            // In production, generate JWT token here
            token: `token_${user._id}`
        });
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};

export const getUserProfile = async (req, res) => {
    try {
        if (req.userId !== req.params.userId && req.userRole !== 'admin') {
            return errorResponse(res, 403, 'Unauthorized access');
        }

        const user = await User.findById(req.params.userId);

        if (!user) {
            return errorResponse(res, 404, 'User not found');
        }

        return successResponse(res, 200, 'User profile retrieved', {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            city: user.city,
            state: user.state,
            zipCode: user.zipCode,
            country: user.country,
            household: user.household,
            role: user.role,
            deviceCount: user.deviceCount,
            totalEnergyUsed: user.totalEnergyUsed,
            createdAt: user.createdAt
        });
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        if (req.userId !== req.params.userId && req.userRole !== 'admin') {
            return errorResponse(res, 403, 'Unauthorized access');
        }

        const {
            name,
            phone,
            address,
            city,
            state,
            zipCode,
            country,
            location,
            occupants,
            mainAppliances
        } = req.body;

        const user = await User.findByIdAndUpdate(
            req.params.userId,
            {
                name,
                phone,
                address,
                city,
                state,
                zipCode,
                country,
                household: {
                    location: location || req.body.household?.location,
                    occupants: occupants !== undefined ? Number(occupants) : req.body.household?.occupants,
                    mainAppliances: Array.isArray(mainAppliances)
                        ? mainAppliances
                        : typeof mainAppliances === 'string'
                        ? mainAppliances.split(',').map((item) => item.trim()).filter(Boolean)
                        : req.body.household?.mainAppliances || []
                },
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        );

        if (!user) {
            return errorResponse(res, 404, 'User not found');
        }

        await auditService.logAction(req.userId || user._id, 'Update Profile', user._id, {
            updatedFields: req.body
        });

        return successResponse(res, 200, 'User profile updated', {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            city: user.city,
            state: user.state,
            zipCode: user.zipCode,
            country: user.country,
            household: user.household
        });
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 10, 100);
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;

        const users = await User.find()
            .limit(limit)
            .skip(skip)
            .sort({ createdAt: -1 });

        const total = await User.countDocuments();

        return res.status(200).json({
            success: true,
            data: users.map(u => ({
                id: u._id,
                name: u.name,
                email: u.email,
                phone: u.phone,
                deviceCount: u.deviceCount,
                isActive: u.isActive,
                createdAt: u.createdAt
            })),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userId);

        if (!user) {
            return errorResponse(res, 404, 'User not found');
        }

        await auditService.logAction(req.userId, 'Delete User', user._id, {
            deletedEmail: user.email,
            deletedName: user.name
        });

        return successResponse(res, 200, 'User deleted successfully');
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};

export const getUserStats = async (req, res) => {
    try {
        if (req.userId !== req.params.userId && req.userRole !== 'admin') {
            return errorResponse(res, 403, 'Unauthorized access');
        }

        const user = await User.findById(req.params.userId);

        if (!user) {
            return errorResponse(res, 404, 'User not found');
        }

        return successResponse(res, 200, 'User statistics retrieved', {
            userId: user._id,
            totalDevices: user.deviceCount,
            totalEnergyUsed: user.totalEnergyUsed,
            isActive: user.isActive,
            memberSince: user.createdAt
        });
    } catch (error) {
        return errorResponse(res, 500, 'Server error', error.message);
    }
};
