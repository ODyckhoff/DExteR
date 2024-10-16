import fs from 'node:fs';
import path from 'node:path';
import { resolveAPU } from '@utils/resolveAPU.js';

class EventsHandler {
    constructor() {

    }

    getEvents(client) {
	console.log('Getting Events');
        const eventPath = resolveAPU('@events', 'path');
        const eventFiles = fs.readdirSync(eventPath).filter(file => file.endsWith('.js'));
        for (const file of eventFiles) {
		console.log('reading file');
        	this.#getFile(file, client);
        }
    }

    #getFile(file, client) {
	const filePath = path.join(resolveAPU('@events', 'path'), file);
	console.log(`Importing ${filePath}...`);
	import(filePath).then(eventModule => {
		const event = eventModule.default;
	        if(event.once) {
			console.log('This is a once event');
	        	client.once(event.name, (...args) => event.execute(...args));
	        }
	        else {
			console.log('This is a on event');
	        	client.on(event.name, (...args) => event.execute(...args));
       	 	}
	})
	.catch(err => {
		console.error(`Error loading event file ${file}: `, err);
	});
    }
}

export { EventsHandler };
