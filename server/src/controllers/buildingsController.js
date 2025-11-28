import Building from "../models/buildingsModel.js";
import { createBuildingId } from "../utils/createId.js";
import { checkDuplicateField } from "../utils/checkDuplicate.js";

export const getAllBuildings = async (req, res) => {
  try {
    const building = await Building.find().sort({ createdAt: -1 });
    res.status(200).json(building);
  } catch (error) {
    console.error("error getAllBuildings", error);
    res.status(500).json({ message: "error getAllBuildings" });
  }
};

export const getBuildingById = async (req, res) => {
  try {
    const { id } = req.params;
    const building = await Building.findOne({ building_id: id });

    if (!building) {
      res.status(404).json({ message: "building not found" });
    }

    res.status(200).json(building);
  } catch (error) {
    console.error("error getBuildingById", error);
    res.status(500).json({ message: "eror getBuildingById" });
  }
};

export const createBuilding = async (req, res) => {
  try {
    const { building_name, building_alias } = req.body;

    if (!building_name || !building_name.trim()) {
      return res.status(400).json({ message: "Building name is required" });
    }

    const building_id = createBuildingId(building_name);

    const { isDuplicate } = await checkDuplicateField( Building, "building_id", building_id );

    if (isDuplicate) { return res.status(400).json({ message: "Building id already exists" });}

    const newBuilding = new Building({ building_id, building_name, building_alias });
    newBuilding.save();
    res.status(201).json({ message: "Create building successfully" });

  } catch (error) {
    console.error("error createBuilding", error);
    res.status(500).json({ message: "error createBuilding" });
  }
};

export const updateBuilding = async (req, res) => {
  try {
    const { id } = req.params;
    const { building_alias } = req.body;

    const updatedBuilding = await Building.findOneAndUpdate(
      { building_id: id },
      { building_alias },
      { new: true }
    );

    if (!updatedBuilding) {
      return res.status(404).json({ message: "building not found" });
    }

    res.status(200).json({ message: "update building", data: updatedBuilding });
  } catch (error) {
    console.error("error updateBuilding", error);
    res.status(500).json({ message: "error updateBuilding" });
  }
};

export const deleteBuilding = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBuilding = await Building.findOneAndDelete({
      building_id: id,
    });

    if (!deletedBuilding) {
      return res.status(404).json({ message: "building not found" });
    }

    res.status(200).json({ message: "delete building successfully" });
  } catch (error) {
    console.error("error deleteBuilding", error);
    res.status(500).json({ message: "error deleteBuilding" });
  }
};
