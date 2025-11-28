import Device from "../models/devicesModel.js";

export const getAllDevices = async (req, res) => {
  try {
    const devices = await Device.find().sort({ createdAt: -1 });
    res.status(200).json(devices);
  } catch (error) {
    console.error("error getAllDevices", error);
    res.status(500).json({ message: "error getAllDevices" });
  }
};

export const getDeviceById = async (req, res) => {
  try {
    const { id } = req.params;
    const device = await Device.findOne({ device_id: id });

    if (!device) {
      res.status(404).json({ message: "device not found" });
    }
    res.status(200).json(device);
  } catch (error) {
    console.error("error getDeviceById", error);
    res.status(500).json({ message: "error getDeviceById" });
  }
};

export const createDevice = async (req, res) => {
  try {
    const { device_id, room_id, device_name, type } = req.body;
    const newDevice = new Device({
      device_id,
      room_id,
      device_name,
      type,
    });
    const existingDevice = await Device.findOne({ device_id: device_id });
    if (existingDevice) {
      return res.status(400).json({ message: "device_id already exists" });
    }
    newDevice.save();
    res.status(201).json({ message: "Create device successfully" });
  } catch (error) {
    console.error("error createDevice", error);
    res.status(500).json({ message: "error createDevice" });
  }
};

export const updateDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const { device_id, room_id, device_name, type } = req.body;
    const updatedDevice = await Device.findOneAndUpdate(
      { device_id: id },
      { device_id, room_id, device_name, type },
      { new: true }
    );
    if (!updatedDevice) {
      return res.status(404).json({ message: "device not found" });
    }

    res
      .status(200)
      .json({ message: "Update device successfully", updatedDevice });
  } catch (error) {
    console.error("error updateDevice", error);
    res.status(500).json({ message: "error updateDevice" });
  }
};

export const deleteDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDevice = await Device.findOneAndDelete({ device_id: id });
    if (!deletedDevice) {
      return res.status(404).json({ message: "device not found" });
    }
    res.status(200).json({ message: "Delete device successfully" });
  } catch (error) {
    console.error("error deleteDevice", error);
    res.status(500).json({ message: "error deleteDevice" });
  }
};
