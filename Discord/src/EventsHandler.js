import fs from 'node:fs';
import path from 'node:path';
import { Client } from 'discord.js';

class EventsHandler {
    constructor() {

    }

    getEvents(client) {
        const eventPath = path.join(global.__rootdir, 'src/events');
        const eventFiles = fs.readdirSync('@events').filter(file => file.endsWith('.js'));
        for (const file of eventFiles) {
            this.#getFile(file);
        }
    }

    #getFile(file) {
        const filePath = path.join(global.__rootdir, 'src/events', file);
        const event = require(filePath);
        if(event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        }
        else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }
}

export { EventsHandler };
