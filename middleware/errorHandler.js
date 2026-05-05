// Not found middleware
export const notFound = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
        timestamp: new Date().toISOString()
    });
};

// Error handling middleware (must be after all other middlewares and routes)
export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: Object.values(err.errors).map(e => e.message),
            timestamp: new Date().toISOString()
        });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(400).json({
            success: false,
            message: `${field} already exists`,
            timestamp: new Date().toISOString()
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid token',
            timestamp: new Date().toISOString()
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expired',
            timestamp: new Date().toISOString()
        });
    }

    // Default error
    return res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        timestamp: new Date().toISOString()
    });
};
