import { SlashCommandBuilder } from 'discord.js';
import { ICommand } from '@lib/ICommand.js';

class CommandPing extends ICommand {
	constructor() {
		super();
	}

	get version() {
		return '1.0';
	}

	get data() {
		return this.#createSlashCommand();
	}

	async execute(interaction) {
		await interaction.reply('Pong!');
	}

	#createSlashCommand() {
		return new SlashCommandBuilder()
			.setName('ping')
			.setDescription('Replies with pong!')
		;
	}
}

export { CommandPing }
