const axios = require('axios');

const fetchConfig = async () => {
    const configServerUrl = process.env.CONFIG_SERVER_URL || 'http://localhost:8889';
    const appName = 'delivery-service';
    const profile = process.env.NODE_ENV || 'default';

    try {
        console.log(`Fetching configuration from ${configServerUrl}/${appName}/${profile}`);
        const response = await axios.get(`${configServerUrl}/${appName}/${profile}`);
        
        const config = {};
        if (response.data && response.data.propertySources) {
            response.data.propertySources.forEach(source => {
                Object.assign(config, source.source);
            });
        }
        return config;
    } catch (error) {
        console.error('Error fetching config from Config Server:', error.message);
        return {};
    }
};

module.exports = fetchConfig;
