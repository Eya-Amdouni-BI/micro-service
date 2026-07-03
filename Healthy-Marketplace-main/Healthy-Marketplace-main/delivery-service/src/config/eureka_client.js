const Eureka = require('eureka-js-client').Eureka;
const config = require('./config');

const eurekaClient = new Eureka({
    instance: {
        app: 'delivery-service',
        hostName: process.env.EUREKA_INSTANCE_HOSTNAME || 'delivery-service',
        ipAddr: process.env.EUREKA_INSTANCE_IP || '127.0.0.1',
        statusPageUrl: `http://${process.env.EUREKA_INSTANCE_HOSTNAME || 'localhost'}:${config.port}/health`,
        port: {
            '$': config.port,
            '@enabled': 'true',
        },
        vipAddress: 'delivery-service',
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn',
        },
    },
    eureka: {
        host: config.eureka.host,
        port: config.eureka.port,
        servicePath: config.eureka.servicePath,
    },
});

module.exports = eurekaClient;
