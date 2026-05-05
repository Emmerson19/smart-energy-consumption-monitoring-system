import User from '../models/User.js';

// Authentication Middleware
export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided',
                timestamp: new Date().toISOString()
            });
        }

        // Simple placeholder token format: token_<userId>
        const [, userId] = token.split('_');
        if (!userId) {
            throw new Error('Invalid token');
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token',
                timestamp: new Date().toISOString()
            });
        }

        req.userId = user._id.toString();
        req.userRole = user.role || 'user';
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid token',
            timestamp: new Date().toISOString()
        });
    }
};

// Role-based authorization
export const authorize = (roles = []) => {
    return (req, res, next) => {
        if (roles.length && !roles.includes(req.userRole)) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized access',
                timestamp: new Date().toISOString()
            });
        }
        next();
    };
};

// Device ownership verification
export const verifyDeviceOwnership = async (req, res, next) => {
    try {
        const Device = (await import('../models/Device.js')).default;
        const device = await Device.findById(req.params.deviceId);

        if (!device) {
            return res.status(404).json({
                success: false,
                message: 'Device not found',
                timestamp: new Date().toISOString()
            });
        }

        if (device.userId.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: 'You do not own this device',
                timestamp: new Date().toISOString()
            });
        }

        req.device = device;
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            timestamp: new Date().toISOString()
        });
    }
};

// Request validation middleware
export const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ 
                message: 'Validation error',
                details: error.details.map(e => e.message)
            });
        }
        req.body = value;
        next();
    };
};
