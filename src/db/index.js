import mongoose from 'mongoose';
import dotenv from 'dotenv';

const ConnectDB = async () => {
    dotenv.config();
    try {
        await mongoose.connect(`${process.env.MONGO_URI}`, {});
        console.log(`Database connected successfully to ${mongoose.connection.host}`);
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
}

export default ConnectDB;