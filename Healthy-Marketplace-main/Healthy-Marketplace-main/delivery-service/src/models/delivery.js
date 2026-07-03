const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    clientName: {
        type: String,
        required: true,
    },
    deliveryAddress: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivered'],
        default: 'Pending'
    },
    driverName: {
        type: String,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Delivery', deliverySchema);
