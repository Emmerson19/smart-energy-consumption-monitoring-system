import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { verifyToken } from './middleware/auth.js';
import { config } from './config/config.js';

// Import routes
import userRoutes from './routes/userRoutes.js';
import deviceRoutes from './routes/deviceRoutes.js';
import consumptionRoutes from './routes/consumptionRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import tariffRoutes from './routes/tariffRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
dotenv.config();

const PORT = process.env.PORT || config.server.port;
const MONGOURL = process.env.MONGO_URL || config.database.url;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Database connection
mongoose
    .connect(MONGOURL, config.database.options)
    .then(() => {
        console.log("✓ Connected to MongoDB successfully");
        app.listen(PORT, () => {
            console.log(`✓ Server is running on port ${PORT}`);
            console.log(`✓ API Base URL: http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("✗ MongoDB connection error:", error);
        process.exit(1);
    });

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/devices', verifyToken, deviceRoutes); // Re-enable auth
app.use('/api/consumption', verifyToken, consumptionRoutes);
app.use('/api/alerts', verifyToken, alertRoutes);
app.use('/api/reports', verifyToken, reportRoutes);
app.use('/api/tariffs', tariffRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Smart Energy Consumption Monitoring System is running',
        timestamp: new Date().toISOString()
    });
});

// Dashboard/Home route
app.get('/api', (req, res) => {
    res.status(200).json({
        application: 'Smart Energy Consumption Monitoring System',
        version: '1.0.0',
        description: 'Complete energy consumption monitoring and analytics platform',
        endpoints: {
            users: '/api/users',
            devices: '/api/devices',
            consumption: '/api/consumption',
            alerts: '/api/alerts',
            reports: '/api/reports',
            health: '/api/health'
        },
        documentation: 'See README.md for detailed API documentation'
    });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

export default app;