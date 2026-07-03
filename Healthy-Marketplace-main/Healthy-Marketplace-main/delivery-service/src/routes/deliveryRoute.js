const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');

router.post('/', deliveryController.createDelivery);
router.get('/', deliveryController.getAllDeliveries);
router.get('/:id', deliveryController.getDeliveryById);
router.patch('/:id/status', deliveryController.updateDeliveryStatus);
router.delete('/:id', deliveryController.deleteDelivery);

module.exports = router;
