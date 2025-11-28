import express from 'express';
import { getAllBuildings, getBuildingById, createBuilding, updateBuilding, deleteBuilding } from '../controllers/buildingsController.js';

const router = express.Router();

router.get('/', getAllBuildings);

router.post('/', createBuilding);

router.get('/:id', getBuildingById);

router.put('/:id', updateBuilding); 

router.delete('/:id', deleteBuilding);

export default router;