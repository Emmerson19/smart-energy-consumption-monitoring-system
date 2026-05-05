// Configuration file for environment-specific settings

export const config = {
    // Database
    database: {
        url: process.env.MONGO_URL || process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/energy-monitoring',
        options: {
            // Mongoose 9+ uses modern default connection behavior.
        }
    },

    // Server
    server: {
        port: process.env.PORT || 7000,
        nodeEnv: process.env.NODE_ENV || 'development'
    },

    // Authentication
    auth: {
        jwtSecret: process.env.JWT_SECRET || 'default_secret_change_in_production',
        jwtExpire: process.env.JWT_EXPIRE || '7d',
        bcryptRounds: 10
    },

    // Email
    email: {
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD
    },

    // SMS
    sms: {
        provider: process.env.SMS_PROVIDER || 'twilio',
        accountSid: process.env.SMS_ACCOUNT_SID,
        authToken: process.env.SMS_AUTH_TOKEN,
        fromNumber: process.env.SMS_FROM_NUMBER
    },

    // Pricing
    pricing: {
        costPerKWh: parseFloat(process.env.COST_PER_KWH) || 0.12
    },

    // Application
    app: {
        name: process.env.APP_NAME || 'Smart Energy Consumption Monitoring System',
        version: process.env.APP_VERSION || '1.0.0',
        timezone: process.env.APP_TIMEZONE || 'UTC',
        logLevel: process.env.LOG_LEVEL || 'debug'
    },

    // CORS
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
    },

    // External APIs
    apis: {
        weather: {
            key: process.env.WEATHER_API_KEY
        },
        analytics: {
            key: process.env.ANALYTICS_API_KEY
        }
    },

    // Pagination
    pagination: {
        defaultLimit: 10,
        maxLimit: 100
    },

    // Alert settings
    alerts: {
        enabled: true,
        channels: ['Email', 'SMS', 'InApp', 'Push'],
        retryAttempts: 3,
        retryDelay: 5000 // ms
    },

    // Report generation
    reports: {
        formats: ['JSON', 'PDF', 'CSV'],
        autoGenerate: true,
        scheduleTime: '00:00' // Midnight
    }
};

export default config;
