import express from 'express';
import { getAllRooms, getRoomById, createRoom, updateRoom, deleteRoom } from '../controllers/roomsController.js';

const router = express.Router();

router.get('/', getAllRooms);

router.post('/', createRoom);

router.get('/:id', getRoomById);

router.put('/:id', updateRoom);

router.delete('/:id', deleteRoom);

export default router;