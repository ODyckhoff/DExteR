import { SlashCommandBuilder } from 'discord.js';

export default function getPingCommand() {
	return {
		data: new SlashCommandBuilder()
			.setName('ping')
			.setDescription('Replies with pong!'),
		async execute(interaction) {
			await interaction.reply('Pong!');
		},
	};
}

