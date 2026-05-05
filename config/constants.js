// Database connection constants

export const DB_COLLECTIONS = {
    USERS: 'users',
    DEVICES: 'devices',
    CONSUMPTION: 'energyconsumptions',
    ALERTS: 'alerts',
    THRESHOLDS: 'thresholds'
};

export const DB_INDEXES = {
    // User indexes
    USER_EMAIL: { email: 1 },
    USER_CREATED: { createdAt: -1 },

    // Device indexes
    DEVICE_USER: { userId: 1 },
    DEVICE_ID: { deviceId: 1 },
    DEVICE_STATUS: { status: 1 },

    // Consumption indexes
    CONSUMPTION_USER_DATE: { userId: 1, createdAt: -1 },
    CONSUMPTION_DEVICE_DATE: { deviceId: 1, createdAt: -1 },
    CONSUMPTION_DATE: { createdAt: -1 },

    // Alert indexes
    ALERT_USER: { userId: 1, isResolved: 1, createdAt: -1 },
    ALERT_DEVICE: { deviceId: 1, createdAt: -1 },

    // Threshold indexes
    THRESHOLD_USER: { userId: 1, isActive: 1 }
};

export const VALIDATION_RULES = {
    name: {
        minLength: 2,
        maxLength: 50
    },
    email: {
        maxLength: 255
    },
    password: {
        minLength: 6,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true
    },
    phone: {
        minLength: 10,
        maxLength: 20
    },
    deviceName: {
        minLength: 2,
        maxLength: 100
    },
    serialNumber: {
        minLength: 1,
        maxLength: 50
    }
};

export const STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    SERVER_ERROR: 500
};

export const ERROR_MESSAGES = {
    INVALID_CREDENTIALS: 'Invalid email or password',
    USER_NOT_FOUND: 'User not found',
    USER_EXISTS: 'User already exists',
    DEVICE_NOT_FOUND: 'Device not found',
    ALERT_NOT_FOUND: 'Alert not found',
    UNAUTHORIZED: 'Unauthorized access',
    INVALID_INPUT: 'Invalid input provided',
    SERVER_ERROR: 'Internal server error'
};

export const SUCCESS_MESSAGES = {
    REGISTERED: 'User registered successfully',
    LOGIN_SUCCESS: 'Login successful',
    CREATED: 'Resource created successfully',
    UPDATED: 'Resource updated successfully',
    DELETED: 'Resource deleted successfully',
    RETRIEVED: 'Data retrieved successfully'
};

export default {
    DB_COLLECTIONS,
    DB_INDEXES,
    VALIDATION_RULES,
    STATUS_CODES,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES
};
