import path from 'node:path';
import fs from 'node:fs';

class ConfigHandler {
    constructor() {
        this.config = this.#loadConfig();
    }

    #loadConfig() {
        const configFilePath = path.join(global.__rootdir, 'config.json');
        const configData = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
        return configData;
    }

    getConfigValue(name) {
        const keys = name.split('.');
        let value = this.config;
        
        for (const key of keys) {
            if (value && Object.hasOwn(value, key)) {
                value = value[key];
            }
            else {
                return undefined;
            }
        }
        
        return value;
    }
}

export { ConfigHandler };

