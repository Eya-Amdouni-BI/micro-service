const express = require('express');
const router = express.Router({ mergeParams: true });
const trackingController = require('../controllers/trackingController');

router.post('/', trackingController.addTrackingUpdate);
router.get('/', trackingController.getDeliveryTracking);

module.exports = router;
