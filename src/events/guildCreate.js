import path from 'path';
import { Events } from 'discord.js';
import { resolveAPU } from '@utils/resolveAPU.js';
import { IEvent } from '@lib/IEvent.js';
const { DatabaseHandler } = await import('@src/DatabaseHandler.js');

class EventGuildCreate extends IEvent {
	constructor(client) {
		super(client);
	}

	get name() {
		return Events.GuildCreate;
	}

	get version() {
		return '0.1';
	}

	get once() {
		return false;
	}

	async execute(guild) {
		console.log(`Joined a new guild: ${guild.name}`);
		try {
			const dbHandler = new DatabaseHandler();
			const guildCreateQuery = 'INSERT INTO guilds VALUES (?, ?);';
			const guildCreateValues = [guild.id, guild.name];
			await dbHandler.queryDatabase(guildCreateQuery,guildCreateValues);
			
			const guildSettingsInitialiseQuery = 'INSERT INTO guild_settings (guild_id) values (?);';
			const guildSettingsInitialiseValues = [guild.id];
			await dbHandler.queryDatabase(guildSettingsInitialiseQuery,guildSettingsInitialiseValues);
		}
		catch (error) {
			console.error(`Error querying database: ${error}`);
		}

	}
}

export { EventGuildCreate }

