import fs  from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname);
global.__rootdir = rootDir;

import { REST, Routes } from 'discord.js';

const configFilePath = path.join(global.__rootdir, 'config.json');
const configData = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));

const clientId = configData.clientId;
const guildId = configData.guildId;
const token = configData.token;

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'src/commands');
const commandFolders = fs.readdirSync(foldersPath);

console.log('Searching for commands');
for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		import(filePath).then(commandModule => {
			if(typeof commandModule.default === 'function') {
				const command = commandModule.default();
				if ('data' in command && 'execute' in command) {
					commands.push(command.data.toJSON());
					console.log(`Found command: ${filePath}`);
				} else {
					console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
				}
			}
			else {
				console.error(`Invalid command module: ${file}. Default export must be a function.`);
			}

			// Construct and prepare an instance of the REST module
			const rest = new REST().setToken(token);

			// and deploy your commands!
			(async () => {
				try {
					console.log(`Started refreshing ${commands.length} application (/) commands.`);
			
					// The put method is used to fully refresh all commands in the guild with the current set
					const data = await rest.put(
						Routes.applicationGuildCommands(clientId, guildId),
						{ body: commands },
					);
			
					console.log(`Successfully reloaded ${data.length} application (/) commands.`);
				} catch (error) {
					// And of course, make sure you catch and log any errors!
					console.error(error);
				}
			})();

		});
	}
}
