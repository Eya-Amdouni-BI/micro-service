const Tracking = require('../models/tracking');
const Delivery = require('../models/delivery');


exports.addTrackingUpdate = async (req, res) => {
    try {
        const { status, location, description } = req.body;

        if (!status) {
            return res.status(400).json({ error: 'Status is required for tracking update' });
        }

        const delivery = await Delivery.findById(req.params.id);
        if (!delivery) {
            return res.status(404).json({ error: 'Delivery not found' });
        }

        const tracking = new Tracking({
            deliveryId: delivery._id,
            status,
            location,
            description
        });

        const savedTracking = await tracking.save();

        
        const validStatuses = ['Pending', 'Shipped', 'Delivered'];
        if (validStatuses.includes(status)) {
            delivery.status = status;
            await delivery.save();
        }

        res.status(201).json({
            tracking: savedTracking,
            delivery: delivery
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getDeliveryTracking = async (req, res) => {
    try {
        const trackings = await Tracking.find({ deliveryId: req.params.id }).sort({ createdAt: -1 });
        res.status(200).json(trackings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
