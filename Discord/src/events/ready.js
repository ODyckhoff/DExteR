import { Events } from 'discord.js';
import { IEvent } from '@lib/IEvent.js'
import { CommandsHandler } from '@src/CommandsHandler.js';

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

	async execute(client, commandsHandler) {
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

		await commandsHandler.globalCmdUpdate( client );
	//	console.dir(client.commands.get('userinfo').data, {depth:null});
		//console.dir(client.commands, {depth:null});
	}
}
export { EventReady }

