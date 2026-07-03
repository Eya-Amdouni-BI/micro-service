const express = require('express');
const cors = require('cors');

const app = express();

// cors() removed to prevent duplicate headers alongside ApiGateway
app.use(express.json());

const deliveryRoutes = require('./src/routes/deliveryRoute');
const trackingRoutes = require('./src/routes/trackingRoute');

app.use('/api/v1/deliveries', deliveryRoutes);
app.use('/api/v1/deliveries/:id/tracking', trackingRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP' });
});

module.exports = app;
