require('dotenv').config();
const app = require('./app');
const connectDB = require('./src/config/db_connect');
const eurekaClient = require('./src/config/eureka_client');
const config = require('./src/config/config');
const fetchConfig = require('./src/config/config_fetcher');
const { consumeOrderCreated, consumeOrderUpdated } = require('./src/config/rabbitmq');
const { createDeliveryFromOrder, updateDeliveryFromOrder } = require('./src/controllers/rabbitConsumer');

const startServer = async () => {
    let retries = 10;
    while (retries > 0) {
        try {
            console.log(`Attempting to start server. Retries left: ${retries}`);
            const remoteConfig = await fetchConfig();
            const PORT = remoteConfig['server.port'] || config.port || 3000;
            const MONGO_URI = remoteConfig['spring.data.mongodb.uri'] || config.mongoUri;
            
            process.env.MONGO_URI = MONGO_URI; 
            
            await connectDB();
            app.listen(PORT, async () => {
                console.log(`Server running on port ${PORT}`);

                if (config.eureka.enabled === 'true' || config.eureka.enabled === true) {
                    const startEureka = () => {
                        eurekaClient.start((error) => {
                            if (error) {
                                console.error('Error starting Eureka client, retrying in 5s...', error.message || error);
                                setTimeout(startEureka, 5000);
                            } else {
                                console.log('Eureka client started successfully');
                            }
                        });
                    };
                    startEureka();
                }

                try {
                    await consumeOrderCreated(createDeliveryFromOrder);
                    await consumeOrderUpdated(updateDeliveryFromOrder);
                    console.log('Connected to RabbitMQ and consuming order.created events');
                } catch (rabbitError) {
                    console.error('Failed to start RabbitMQ consumer:', rabbitError.message || rabbitError);
                }
            });
            break; // Success! Exit the retry loop.
        } catch (error) {
            console.error('Failed to start server (Config/DB Error). Retrying in 5s...', error.message || error);
            retries -= 1;
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
    if (retries === 0) {
        console.error('Server failed to start after maximum retries. Exiting.');
        process.exit(1);
    }
};

startServer();
