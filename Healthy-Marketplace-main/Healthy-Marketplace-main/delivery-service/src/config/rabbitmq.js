const amqp = require('amqplib');
const config = require('./config');

const ORDER_CREATED_QUEUE = 'order.created.queue';
const ORDER_UPDATED_QUEUE = 'order.updated.queue';
const EXCHANGE = 'healthy-market-exchange';
const ROUTING_KEY = 'order.created';
const LOG_EXCHANGE = 'service.logs';
const LOG_ROUTING_KEY = 'service.log';
const LOG_QUEUE = 'service.logs.queue';

let channel;

const connectRabbit = async () => {
  const rabbitUrl = process.env.RABBITMQ_URL || config.rabbitUrl || 'amqp://guest:guest@rabbitmq:5672';
  const connection = await amqp.connect(rabbitUrl);
  channel = await connection.createChannel();
  await channel.assertExchange(EXCHANGE, 'direct', { durable: true });
  await channel.assertQueue(ORDER_CREATED_QUEUE, { durable: true });
  await channel.bindQueue(ORDER_CREATED_QUEUE, EXCHANGE, ROUTING_KEY);
  await channel.assertQueue(ORDER_UPDATED_QUEUE, { durable: true });
  await channel.bindQueue(ORDER_UPDATED_QUEUE, EXCHANGE, 'order.updated');
  await channel.assertExchange(LOG_EXCHANGE, 'direct', { durable: true });
  await channel.assertQueue(LOG_QUEUE, { durable: true });
  await channel.bindQueue(LOG_QUEUE, LOG_EXCHANGE, LOG_ROUTING_KEY);
  return channel;
};

const normalizePayload = (payload) => {
  if (!payload) return null;

  if (typeof payload === 'string') {
    try {
      return normalizePayload(JSON.parse(payload));
    } catch {
      return payload;
    }
  }

  if (typeof payload === 'object' && payload !== null && payload.payload) {
    return normalizePayload(payload.payload);
  }

  return payload;
};

const parsePayload = (content) => {
  const raw = content.toString();
  if (!raw) return null;
  try {
    return normalizePayload(JSON.parse(raw));
  } catch {
    return normalizePayload(raw);
  }
};

const consumeOrderCreated = async (handler) => {
  if (!channel) {
    await connectRabbit();
  }
  await channel.consume(ORDER_CREATED_QUEUE, async (msg) => {
    if (msg) {
      try {
        const payload = parsePayload(msg.content);
        await handler(payload);
        channel.ack(msg);
      } catch (err) {
        console.error('Failed to process order.created message:', err.message || err);
        channel.nack(msg, false, false);
      }
    }
  }, { noAck: false });
};

const consumeOrderUpdated = async (handler) => {
  if (!channel) {
    await connectRabbit();
  }
  await channel.consume(ORDER_UPDATED_QUEUE, async (msg) => {
    if (msg) {
      try {
        const payload = parsePayload(msg.content);
        await handler(payload);
        channel.ack(msg);
      } catch (err) {
        console.error('Failed to process order.updated message:', err.message || err);
        channel.nack(msg, false, false);
      }
    }
  }, { noAck: false });
};

const publishServiceLog = async (service, level, message, meta = {}) => {
  if (!channel) {
    await connectRabbit();
  }
  const payload = { timestamp: new Date().toISOString(), service, level, message, meta };
  try {
    channel.publish(LOG_EXCHANGE, LOG_ROUTING_KEY, Buffer.from(JSON.stringify(payload)), { persistent: true });
  } catch (err) {
    console.error('Failed to publish service log:', err.message || err);
  }
  return payload;
};

module.exports = {
  connectRabbit,
  consumeOrderCreated,
  consumeOrderUpdated,
  publishServiceLog,
};
