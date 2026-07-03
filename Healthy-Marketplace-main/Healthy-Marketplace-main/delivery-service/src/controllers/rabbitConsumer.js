const Delivery = require('../models/delivery');
const Tracking = require('../models/tracking');

const getOrderId = (payload) => {
  if (!payload) return null;

  if (typeof payload === 'string') {
    const normalized = payload.trim();
    if (normalized.startsWith('{') && normalized.endsWith('}')) {
      const objMatch = normalized.match(/"?orderId"?\s*[:=]\s*"?([A-Za-z0-9-]+)"?/i);
      if (objMatch) return objMatch[1];
    }
    const match = normalized.match(/orderId\s*[:=]\s*([A-Za-z0-9-]+)/i);
    if (match) return match[1];
    return normalized;
  }

  if (typeof payload === 'object') {
    return payload.orderId || payload.id || payload.order?.id || payload.order?.orderId || null;
  }

  return null;
};

const getOrderStatus = (payload) => {
  if (!payload) return null;

  if (typeof payload === 'string') {
    const normalized = payload.trim();
    if (normalized.startsWith('{') && normalized.endsWith('}')) {
      const statusMatch = normalized.match(/"?status"?\s*[:=]\s*"?([A-Za-z0-9-]+)"?/i);
      if (statusMatch) return statusMatch[1];
    }
    return null;
  }

  if (typeof payload === 'object') {
    return payload.status || payload.order?.status || null;
  }

  return null;
};

const createDeliveryFromOrder = async (payload) => {
  const orderId = getOrderId(payload);
  if (!orderId) {
    throw new Error('Invalid order.created payload');
  }

  const existing = await Delivery.findOne({ orderId: String(orderId) });
  if (existing) {
    return existing;
  }

  const delivery = new Delivery({
    orderId: String(orderId),
    clientName: payload.userId ? String(payload.userId) : 'Unknown',
    deliveryAddress: payload.deliveryAddress || payload.order?.deliveryAddress || 'Pending address',
    status: 'Pending'
  });
  const savedDelivery = await delivery.save();

  const tracking = new Tracking({
    deliveryId: savedDelivery._id,
    status: 'Pending',
    description: 'Delivery created from OrderCreated event'
  });
  await tracking.save();

  console.info(`Created delivery for order ${orderId}`);
  return savedDelivery;
};

const updateDeliveryFromOrder = async (payload) => {
  const rawPayload = typeof payload === 'string' ? payload : payload;
  const orderId = getOrderId(rawPayload);
  const status = getOrderStatus(rawPayload);
  console.info(`updateDeliveryFromOrder received orderId=${orderId} status=${status}`);

  if (!orderId) {
    throw new Error('Invalid order.updated payload');
  }

  const existing = await Delivery.findOne({ orderId: String(orderId) });
  if (!existing) {
    console.info(`No delivery found for order ${orderId}`);
    return null;
  }

  const mapStatus = (orderStatus) => {
    if (!orderStatus) return null;
    const s = String(orderStatus).toLowerCase();
    if (s.includes('deliver') || s.includes('complete') || s.includes('completed')) return 'Delivered';
    if (s.includes('ship') || s.includes('shipped')) return 'Shipped';
    if (s.includes('confirm') || s.includes('pending')) return 'Pending';
    if (s.includes('cancel')) return 'Pending';
    return null;
  };

  const mapped = mapStatus(status);
  console.info(`Mapped status for order ${orderId}: ${mapped}`);
  if (mapped && existing.status !== mapped) {
    const old = existing.status;
    existing.status = mapped;
    if (payload && payload.deliveryAddress) existing.deliveryAddress = payload.deliveryAddress;
    if (payload && payload.driverName) existing.driverName = payload.driverName;
    const saved = await existing.save();

    const tracking = new Tracking({
      deliveryId: saved._id,
      status: mapped,
      description: `Status changed from ${old} to ${mapped} (OrderService: ${status})`
    });
    await tracking.save();

    console.info(`Updated delivery ${saved._id} for order ${orderId} to ${mapped}`);
    return saved;
  }

  return existing;
};

module.exports = {
  createDeliveryFromOrder,
  updateDeliveryFromOrder,
};
