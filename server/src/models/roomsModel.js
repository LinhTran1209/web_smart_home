import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
    {
        room_id: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        }, 
        building_id: {
            type: String,
            required: true,
            trim: true,
        },
        room_name: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true,
        collection: 'rooms',
    }
);

const Room = mongoose.model('Room', roomSchema);

export default Room;