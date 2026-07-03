const Delivery = require('../models/delivery');
const Tracking = require('../models/tracking');


exports.createDelivery = async (req, res) => {
    try {
        const { orderId, clientName, deliveryAddress, trackingHistory } = req.body;

        if (!orderId || !clientName || !deliveryAddress) {
            return res.status(400).json({ error: 'orderId, clientName, and deliveryAddress are required' });
        }

        // Check if delivery already exists for this order
        const existingDelivery = await Delivery.findOne({ orderId });
        if (existingDelivery) {
            return res.status(409).json({ error: `A delivery for orderId '${orderId}' already exists.` });
        }

        const delivery = new Delivery({
            orderId,
            clientName,
            deliveryAddress
        });

        const savedDelivery = await delivery.save();


        const tracking = new Tracking({
            deliveryId: savedDelivery._id,
            status: 'Pending',
            description: 'Order details received'
        });
        await tracking.save();

        res.status(201).json({
            delivery: savedDelivery,
            initialTracking: tracking
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getAllDeliveries = async (req, res) => {
    try {
        const deliveries = await Delivery.find();
        res.status(200).json(deliveries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getDeliveryById = async (req, res) => {
    try {
        const delivery = await Delivery.findById(req.params.id);
        if (!delivery) {
            return res.status(404).json({ error: 'Delivery not found' });
        }
        res.status(200).json(delivery);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.updateDeliveryStatus = async (req, res) => {
    try {
        const { status, driverName, location, description } = req.body;
        const validStatuses = ['Pending', 'Shipped', 'Delivered'];

        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        const delivery = await Delivery.findById(req.params.id);
        if (!delivery) {
            return res.status(404).json({ error: 'Delivery not found' });
        }

        if (status) delivery.status = status;
        if (driverName) delivery.driverName = driverName;

        const updatedDelivery = await delivery.save();

        if (status) {
            const tracking = new Tracking({
                deliveryId: updatedDelivery._id,
                status: status,
                location: location || null,
                description: description || `Status updated to ${status}`
            });
            await tracking.save();
        }

        res.status(200).json(updatedDelivery);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.deleteDelivery = async (req, res) => {
    try {
        const deletedDelivery = await Delivery.findByIdAndDelete(req.params.id);
        if (!deletedDelivery) {
            return res.status(404).json({ error: 'Delivery not found' });
        }

        await Tracking.deleteMany({ deliveryId: req.params.id });

        res.status(200).json({ message: 'Delivery deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
