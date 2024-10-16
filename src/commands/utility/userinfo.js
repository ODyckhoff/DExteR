import {SlashCommandBuilder } from 'discord.js';
import { ICommand } from '@lib/ICommand.js';

class CommandUserInfo extends ICommand {
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
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
	}


	#createSlashCommand() {
		return new SlashCommandBuilder()
			.setName('userinfo')
			.setDescription('Provides information about the user.')
		;
	}
}

export { CommandUserInfo }

