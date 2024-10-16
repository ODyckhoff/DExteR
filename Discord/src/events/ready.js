import { Events } from 'discord.js';
import { IEvent } from '@lib/IEvent.js'

class EventReady extends IEvent {
	constructor(client) {
		console.log('EventReady was instantiated');
		super(client);
	}

	get version() {
		console.log('EventReady version was fetched');
		return '0.1';
	}

	get name() {
		console.log('Event.ClientReady name was fetched');
		return Events.ClientReady;
	}

	get once() {
		return true;
	}

	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		client.user.setPresence({
			activities: [
				{
					name: 'Watching your shenanigans',
					type: 4
				}
			],
			status: 'online',
			afk: false
		});
	}
}
export { EventReady }

