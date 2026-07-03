const amqp = require('amqplib');
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672';
const LOG_EXCHANGE = 'service.logs';
const LOG_ROUTING_KEY = 'service.log';

let channel;

const connectRabbit = async () => {
  if (channel) return channel;
  const connection = await amqp.connect(RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertExchange(LOG_EXCHANGE, 'direct', { durable: true });
  return channel;
};

const publish = async (service, level, message, meta = {}) => {
  const payload = {
    timestamp: new Date().toISOString(),
    service,
    level,
    message,
    meta
  };
  const ch = await connectRabbit();
  ch.publish(LOG_EXCHANGE, LOG_ROUTING_KEY, Buffer.from(JSON.stringify(payload)), { persistent: true });
};

module.exports = { publish };
