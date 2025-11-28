import mongoose from "mongoose";

const statusItemSchema = new mongoose.Schema(
  {
    property: {
      type: String,
      required: true,
      trim: true,
      // Ví dụ: "on_off", "mode", "fan_speed", "temp"
    },
    value: {
      // Có thể là string ("on", "cool", "medium")
      // hoặc number (10, 24, ...)
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { _id: false }
);

// Schema chính cho device state
const deviceStateSchema = new mongoose.Schema(
  {
    device_id: {
      type: String,
      required: true,
      trim: true,
      // VD: "A1:B2:C3:D4", "9F:2A:7B:4C", "DE:10:5F:8A"
      description: "Địa chỉ MAC hoặc ID của thiết bị",
    },

    device_type: {
      type: String,
      enum: ["led_1", "fan_1", "ac_1", "tv_1", "projector_1", "speaker_1"],
      required: true,
    },

    // "2025-11-11T14:00:00.000Z"
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },

    // Mảng các trạng thái tại thời điểm timestamp
    status: {
      type: [statusItemSchema],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "status array must not be empty",
      },
      description:
        "Mảng các trạng thái hoặc thuộc tính thiết bị tại thời điểm timestamp",
    },
  },
  {
    timestamps: true,
    collection: "devices_state",
  }
);

const DeviceState = mongoose.model("DeviceState", deviceStateSchema);

export default DeviceState;
