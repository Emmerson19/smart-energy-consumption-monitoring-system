// Validation utilities
export const validateEmail = (email) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
};

export const validatePhone = (phone) => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.length >= 10;
};

export const validatePassword = (password) => {
    // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

export const validateDeviceId = (deviceId) => {
    return /^[A-Za-z0-9\-_]+$/.test(deviceId) && deviceId.length > 0;
};

export const validateSerialNumber = (serialNumber) => {
    return /^[A-Za-z0-9\-]+$/.test(serialNumber) && serialNumber.length > 0;
};

export const validateConsumptionValue = (value) => {
    return typeof value === 'number' && value >= 0;
};

export const validateThresholdValue = (value) => {
    return typeof value === 'number' && value > 0;
};

export const validateCoordinates = (latitude, longitude) => {
    return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
};

export const validateDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start < end;
};

export const validateMongoId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
};

export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input.trim().replace(/[<>]/g, '');
};

export const validateInputLength = (input, maxLength) => {
    return input.length <= maxLength;
};
