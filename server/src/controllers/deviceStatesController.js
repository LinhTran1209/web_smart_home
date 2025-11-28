import DeviceState from "../models/deviceStatesModel.js";

export const getAllDeviceStates = async (req, res) => {
  try {
    const deviceStates = await DeviceState.find().sort({ createdAt: -1 });
    res.status(200).json(deviceStates);
  } catch (error) {
    console.error("error getAllDeviceStates", error);
    res.status(500).json({ message: "error getAllDeviceStates" });
  }
};

export const getDeviceStateById = async (req, res) => {
  try {
    const { id } = req.params;
    const deviceStates = await DeviceState.find({ device_id: id });
    if (!deviceStates || deviceStates.length === 0) {
      return res.status(404).json({ message: "device states not found" });
    }
    res.status(200).json(deviceStates);
  } catch (error) {
    console.error("error getDeviceStateByDeviceId", error);
    res.status(500).json({ message: "error getDeviceStateByDeviceId" });
  }
};

export const createDeviceState = async (req, res) => {
  try {
    const { device_id, device_type, timestamp, status } = req.body;
    const newDeviceState = new DeviceState({
      device_id,
      device_type,
      timestamp,
      status,
    });
    newDeviceState.save();
    res.status(201).json({ message: "Create device state successfully" });
  } catch (error) {
    console.error("error createDeviceState", error);
    res.status(500).json({ message: "error createDeviceState" });
  }
};

export const updateDeviceState = async (req, res) => {
  try {
    const { id } = req.params;
    const { device_type, timestamp, status } = req.body;
    const updatedDeviceState = await DeviceState.findOneAndUpdate(
      {
        device_id: id,
      },
      {
        device_type,
        timestamp,
        status,
      },
      { new: true }
    );
    if (!updatedDeviceState) {
      return res.status(404).json({ message: "device state not found" });
    }
    res.status(200).json({ message: "Update device state successfully" });
  } catch (error) {
    console.error("error updateDeviceState", error);
    res.status(500).json({ message: "error updateDeviceState" });
  }
};

export const deleteDeviceState = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedResult = await DeviceState.deleteMany({ device_id: id });
    if (deletedResult.deletedCount === 0) {
      return res.status(404).json({ message: "device states not found" });
    }
    res.status(200).json({ message: "Delete device states successfully" });
  } catch (error) {
    console.error("error deleteDeviceStatesByDeviceId", error);
    res.status(500).json({ message: "error deleteDeviceStatesByDeviceId" });
  }
};

export const deleteAllDeviceStates = async (req, res) => {
  try {
    await DeviceState.deleteMany({});
    res.status(200).json({ message: "Delete all device states successfully" });
  } catch (error) {
    console.error("error deleteAllDeviceStates", error);
    res.status(500).json({ message: "error deleteAllDeviceStates" });
  }
};
