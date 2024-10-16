import { Events } from 'discord.js';

export default {
	name: Events.MessageCreate,
	async execute(message) {
		if(message.author.bot) return;

		console.log(`New message in ${message.guild.name} / #${message.channel.name}: ${message.content}`);
		console.log(JSON.stringify(message.channel));

		if(message.content.toLowerCase().match('^!ping$')) {
			await message.reply('pong!');
		}
	}
};
