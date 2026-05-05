import express from 'express';
import * as tariffController from '../controllers/tariffController.js';
import { verifyToken, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, tariffController.getCurrentTariff);
router.get('/all', verifyToken, authorize(['admin']), tariffController.listTariffs);
router.post('/', verifyToken, authorize(['admin']), tariffController.createTariff);
router.put('/:tariffId', verifyToken, authorize(['admin']), tariffController.updateTariff);

export default router;
