import path from 'node:path';
import fs from 'node:fs';
import { resolveAPU } from '@utils/resolveAPU.js';

class ConfigHandler {
    constructor(name = 'config.json') {
        this.config = this.#loadConfig(name);
    }

    #loadConfig(configName) {
        const configFilePath = path.join(resolveAPU('@root', 'path'), configName);
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

