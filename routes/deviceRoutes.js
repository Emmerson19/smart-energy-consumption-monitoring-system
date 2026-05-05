import express from 'express';
import * as deviceController from '../controllers/deviceController.js';

const router = express.Router();

// Device CRUD operations
router.post('/:userId/devices', deviceController.createDevice);
router.get('/:userId/devices', deviceController.getDevices);
router.get('/devices/:deviceId', deviceController.getDevice);
router.put('/devices/:deviceId', deviceController.updateDevice);
router.delete('/devices/:deviceId', deviceController.deleteDevice);

// Device status management
router.patch('/devices/:deviceId/status', deviceController.updateDeviceStatus);
router.patch('/devices/:deviceId/online-status', deviceController.updateDeviceOnlineStatus);

// Device statistics
router.get('/devices/:deviceId/stats', deviceController.getDeviceStats);

export default router;
