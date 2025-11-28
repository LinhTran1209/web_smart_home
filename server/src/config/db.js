import mongoose from 'mongoose';

export const connectDB = async (MONGO_URL) => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log('MongoDB connected successfully');
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};