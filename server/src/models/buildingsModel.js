import mongoose from "mongoose";

const buildingSchema = new mongoose.Schema(
  {
    building_id: {
      type: String,
      required: true,
      unique: true, 
      trim: true,
    },
    building_name: {
      type: String,
      required: true, 
      trim: true,
    },
    building_alias: {
      type: String,
      trim: true, 
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "buildings",
  }
);


const Building = mongoose.model("Building", buildingSchema);

export default Building