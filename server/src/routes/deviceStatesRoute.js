import express from 'express';
import { getAllDeviceStates, getDeviceStateById, createDeviceState, updateDeviceState, deleteDeviceState } from '../controllers/deviceStatesController.js';

const router = express.Router();

router.get('/', getAllDeviceStates);

router.post('/', createDeviceState);

router.get('/:id', getDeviceStateById);

router.put('/:id', updateDeviceState);

router.delete('/:id', deleteDeviceState);

export default router;