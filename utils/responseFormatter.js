// Response formatting utilities
export const successResponse = (res, statusCode, message, data = null) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        timestamp: new Date().toISOString()
    });
};

export const errorResponse = (res, statusCode, message, errors = null) => {
    return res.status(statusCode).json({
        success: false,
        message,
        errors,
        timestamp: new Date().toISOString()
    });
};

export const paginatedResponse = (res, statusCode, message, data, page, limit, total) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
            hasMore: page < Math.ceil(total / limit)
        },
        timestamp: new Date().toISOString()
    });
};

export const formatConsumptionData = (consumptions) => {
    return consumptions.map(item => ({
        id: item._id,
        timestamp: item.timestamp,
        consumption: item.consumption,
        cost: item.cost,
        voltage: item.voltage,
        current: item.current,
        powerFactor: item.powerFactor
    }));
};

export const formatDeviceData = (device) => {
    return {
        id: device._id,
        deviceName: device.deviceName,
        deviceId: device.deviceId,
        deviceType: device.deviceType,
        location: device.location,
        status: device.status,
        isOnline: device.isOnline,
        currentReading: device.currentReading,
        dailyBudget: device.dailyBudget,
        monthlyBudget: device.monthlyBudget,
        installationDate: device.installationDate
    };
};

export const formatAlertData = (alert) => {
    return {
        id: alert._id,
        alertType: alert.alertType,
        title: alert.title,
        description: alert.description,
        severity: alert.severity,
        isResolved: alert.isResolved,
        createdAt: alert.createdAt
    };
};
