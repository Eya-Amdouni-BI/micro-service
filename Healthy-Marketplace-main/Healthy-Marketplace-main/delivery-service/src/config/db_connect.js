const mongoose = require('mongoose');
const config = require('./config');

const connectDB = async () => {
    try {
        if (!config.mongoUri) {
            throw new Error('MongoDB URI is not defined');
        }
        // Mongoose 7.x handles connecting properly without deprecated options
        const conn = await mongoose.connect(config.mongoUri);
        console.log(`Connected to MongoDB successfully: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
