import { Events } from 'discord.js';
import { IEvent } from '@lib/IEvent.js'
import { CommandsHandler } from '@src/CommandsHandler.js';
import { LogHandler } from '@src/LogHandler.js';

class EventReady extends IEvent {
	constructor(client) {
		super(client);
		this.logger = new LogHandler();
	}

	get version() {
		return '0.1';
	}

	get name() {
		return Events.ClientReady;
	}

	get once() {
		return true;
	}

	async execute(client, commandsHandler) {
		this.logger.log(`Ready! Logged in as ${client.user.tag}`, 'success', 'EventReady');
		client.user.setUsername("DExteR");
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

