import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
    device_id: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    room_id: {
        type: String,
        required: true,
        trim: true,
    }, 
    device_name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['device', 'sensor'],
        default: 'device'
    }

});

const Device = mongoose.model('Device', deviceSchema);

export default Device;