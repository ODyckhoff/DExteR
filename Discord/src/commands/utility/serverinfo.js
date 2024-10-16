import { SlashCommandBuilder } from 'discord.js';
import { ICommand } from '@lib/ICommand.js';

class CommandServerInfo extends ICommand {
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
		// interaction.guild is the object representing the Guild in which the command was run
		await interaction.reply(`This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`);
	}

	#createSlashCommand() {
		return new SlashCommandBuilder()
			.setName('serverinfo')
			.setDescription('Provides information about the server.')
		;
	}
}

export { CommandServerInfo }

