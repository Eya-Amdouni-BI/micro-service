const mongoose = require('mongoose');

const trackingSchema = new mongoose.Schema({
    deliveryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Delivery',
        required: true
    },
    status: {
        type: String,
        required: true
    },
    location: {
        type: String,
    },
    description: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Tracking', trackingSchema);
