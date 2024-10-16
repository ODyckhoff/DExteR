import { Events } from 'discord.js';
import { IEvent } from '@lib/IEvent.js';

class EventMessageCreate extends IEvent {
	constructor(client) {
		super(client);
	}

	get name() {
		return Events.MessageCreate;
	}

	get version() {
		return '0.1';
	}

	get once() {
		return false;
	}

	async execute(message) {
		if(message.author.bot) return;

		console.log(`New message in ${message.guild.name} / #${message.channel.name}: ${message.content}`);
		console.log(JSON.stringify(message.channel));

		if(message.content.toLowerCase().match('^!ping$')) {
			await message.reply('pong!');
		}
	}
}

export { EventMessageCreate }

