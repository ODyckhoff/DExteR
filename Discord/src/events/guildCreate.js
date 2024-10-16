import path from 'path';

import { Events } from 'discord.js';

const databaseHandlerPath = path.join(global.__rootdir, 'src/DatabaseHandler.js');
const { DatabaseHandler } = await import(databaseHandlerPath);

export default {
	name: Events.GuildCreate,
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

