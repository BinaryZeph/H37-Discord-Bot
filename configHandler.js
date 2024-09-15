// configHandler.js
const fs = require('fs');
const configPath = './config.json';

function loadConfig() {
    let config;
    try {
        console.log('Loading config...');
        config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        console.log('Config loaded successfully:');
        console.log(config);
    } catch (error) {
        console.error(`Error loading config file: ${error.message}`);
        process.exit(1);
    }
    return config;
}

function saveConfig(config) {
    try {
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
        console.log('Config saved successfully.');
    } catch (error) {
        console.error(`Error saving config file: ${error.message}`);
    }
}

module.exports = { loadConfig, saveConfig };
