import Room from "../models/roomsModel.js";
import { createRoomId } from "../utils/createId.js";
import { checkDuplicateField } from "../utils/checkDuplicate.js";

export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 });
    res.status(200).json(rooms);
  } catch (error) {
    console.error("error getAllRooms", error);
    res.status(500).json({ message: "error getAllRooms" });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findOne({ room_id: id });

    if (!room) {
      res.status(404).json({ message: "room not found" });
    }
    res.status(200).json(room);
  } catch (error) {
    console.error("error getRoomById", error);
    res.status(500).json({ message: "error getRoomById" });
  }
};

export const createRoom = async (req, res) => {
  try {
    const { building_id, room_name } = req.body;

    if (!room_name || !room_name.trim()) {
      return res.status(400).json({
        message: "room name are required",
      });
    }

    const room_id = createRoomId(building_id, room_name);

    const { isDuplicate } = await checkDuplicateField(Room, "room_id", room_id);

    if (isDuplicate) {
      return res.status(400).json({ message: "room id already exists" });
    }
    const newRoom = new Room({
      room_id,
      building_id,
      room_name,
    });

    newRoom.save();
    res.status(201).json({ message: "Create room successfully" });
  } catch (error) {
    console.error("error createRoom", error);
    res.status(500).json({ message: "error createRoom" });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { building_id, room_name } = req.body;
    const updatedRoom = await Room.findOneAndUpdate(
      { room_id: id },
      { building_id, room_name },
      { new: true }
    );
    if (!updatedRoom) {
      return res.status(404).json({ message: "room not found" });
    }
    res.status(200).json({ message: "Update room successfully", updatedRoom });
  } catch (error) {
    console.error("error updateRoom", error);
    res.status(500).json({ message: "error updateRoom" });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRoom = await Room.findOneAndDelete({ room_id: id });

    if (!deletedRoom) {
      return res.status(404).json({ message: "room not found" });
    }
    res.status(200).json({ message: "Delete room successfully" });
  } catch (error) {
    console.error("error deleteRoom", error);
    res.status(500).json({ message: "error deleteRoom" });
  }
};
