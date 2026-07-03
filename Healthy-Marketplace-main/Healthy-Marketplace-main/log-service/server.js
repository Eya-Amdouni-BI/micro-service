const express = require('express');
const amqp = require('amqplib');
const cors = require('cors');
const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const PORT = process.env.PORT || 8090;
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672';
const KEYCLOAK_URL = process.env.KEYCLOAK_URL || 'http://localhost:8080';
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM || 'healthy-market-realm';
const EXCHANGE = 'service.logs';
const ROUTING_KEY = 'service.log';
const LOG_QUEUE = 'service.logs.queue';
const MAX_LOG_ENTRIES = 250;

const jwtCheck = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 10,
    jwksUri: `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/certs`
  }),
  issuer: `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}`,
  algorithms: ['RS256'],
  getToken: (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    }
    if (req.query.access_token) {
      return req.query.access_token;
    }
    return null;
  }
});

const adminOnly = (req, res, next) => {
  const roles = req.auth?.realm_access?.roles;
  if (Array.isArray(roles) && roles.includes('admin')) {
    return next();
  }
  return res.status(403).json({ error: 'Access denied' });
};

const app = express();
app.use(cors());
app.use(express.json());

let channel;
let connection;
const logs = [];
const streamClients = new Set();

const addLog = (entry) => {
  logs.push(entry);
  if (logs.length > MAX_LOG_ENTRIES) {
    logs.shift();
  }
  const data = `data: ${JSON.stringify(entry)}\n\n`;
  for (const res of streamClients) {
    try {
      res.write(data);
    } catch (err) {
      streamClients.delete(res);
    }
  }
};

const connectRabbit = async () => {
  if (channel) return channel;
  connection = await amqp.connect(RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertExchange(EXCHANGE, 'direct', { durable: true });
  await channel.assertQueue(LOG_QUEUE, { durable: true });
  await channel.bindQueue(LOG_QUEUE, EXCHANGE, ROUTING_KEY);

  await channel.consume(LOG_QUEUE, (msg) => {
    if (!msg) return;
    try {
      const content = msg.content.toString();
      const logEntry = JSON.parse(content);
      addLog(logEntry);
      channel.ack(msg);
    } catch (err) {
      console.error('Failed to parse log message:', err.message || err);
      channel.nack(msg, false, false);
    }
  }, { noAck: false });

  console.log('Log service connected to RabbitMQ and consuming service.logs');
  return channel;
};

const publishLog = async (service, level, message, meta = {}) => {
  const payload = {
    timestamp: new Date().toISOString(),
    service,
    level,
    message,
    meta
  };

  if (!channel) {
    await connectRabbit();
  }

  channel.publish(EXCHANGE, ROUTING_KEY, Buffer.from(JSON.stringify(payload)), { persistent: true });
  return payload;
};

app.get('/logs', jwtCheck, adminOnly, (_req, res) => {
  res.json(logs.slice().reverse());
});

app.get('/logs/stream', jwtCheck, adminOnly, (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  });
  res.flushHeaders();
  res.write('retry: 5000\n\n');
  streamClients.add(res);

  for (const entry of logs.slice().reverse()) {
    res.write(`data: ${JSON.stringify(entry)}\n\n`);
  }

  req.on('close', () => {
    streamClients.delete(res);
  });
});

app.post('/logs', async (req, res) => {
  const { service, level, message, meta } = req.body;
  if (!service || !level || !message) {
    return res.status(400).json({ error: 'service, level and message are required' });
  }
  try {
    const entry = await publishLog(service, level, message, meta);
    return res.status(201).json(entry);
  } catch (err) {
    console.error('Failed to publish log:', err.message || err);
    return res.status(500).json({ error: 'Failed to publish log' });
  }
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const start = async () => {
  try {
    await connectRabbit();
  } catch (err) {
    console.error('Unable to connect to RabbitMQ:', err.message || err);
  }

  app.listen(PORT, () => {
    console.log(`Log service listening on port ${PORT}`);
  });
};

start();
