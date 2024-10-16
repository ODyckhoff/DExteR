import path from 'path';
import { Events } from 'discord.js';
import { resolveAPU } from '@utils/resolveAPU.js';
import { IEvent } from '@lib/IEvent.js';

const commandsHandlerPath = resolveAPU('@src/CommandsHandler.js', 'path');
const { CommandsHandler } = await import(commandsHandlerPath);

class EventInteractionCreate extends IEvent {
	constructor(client) {
		super(client);
	}

	get version() {
		return '0.1';
	}

	get name() {
		return Events.InteractionCreate;
	}

	get once() {
		return false;
	}

	async execute(interaction) {

	}
}

export { EventInteractionCreate }

