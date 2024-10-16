import path from 'node:path';
import fs from 'node:fs';
import { resolveAPU } from '@utils/resolveAPU.js';

class ConfigHandler {
    constructor(relPath = 'config.json') {
	this.configPath = relPath;
	this.init();
    }

    async init() {
	try {
	    this.loadedConfig = await this.#loadConfig(this.configPath);
	}
	catch( err ) {
		console.error("Error loading config: ", err);
	}
    }

    get config() {
	    return this.loadedConfig;
    }

    async #loadConfig(configName) {
        const configFilePath = path.join(resolveAPU('@root', 'path'), configName);
        const configData = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
        return configData;
    }

    #writeConfig(configName, configPath, configData) {
        const fullPathWithName = path.join(resolveAPU('@root', 'path'), configPath, configName);
	fs.writeFileSync(fullPathWithName, configData, err => {
	    if(err) {
                console.error(err);
	    }
	});
    }

    async getConfigValue(name) {
	while(!this.loadedConfig) {
	    await new Promise(resolve => setTimeout(resolve, 100));
	}
        const keys = name.split('.');
        let value = this.loadedConfig;
	//console.dir(value, {depth:null});
        
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

