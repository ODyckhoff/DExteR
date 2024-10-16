console.log("Welcome to dbot!");
console.log("");
console.log("[LOG] This is what a console.log looks like.");
console.warn("[WARN] This is what a console.warn looks like.");
console.error("[ERROR] This is what a console.error looks like.");

import path from 'path';
import { fileURLToPath } from 'node:url';
import { Client, GatewayIntentBits } from 'discord.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname);
global.__rootdir = rootDir;

const configHandlerPath = path.join(global.__rootdir, 'src/ConfigHandler.js');
const commandsHandlerPath = path.join(global.__rootdir, '/src/CommandsHandler.js');
const eventsHandlerPath = path.join(global.__rootdir, '/src/EventsHandler.js');
const moduleHandlerPath = path.join(global.__rootdir, '/src/ModuleHandler.js');

const { ConfigHandler   } = await import(configHandlerPath  );
const { CommandsHandler } = await import(commandsHandlerPath);
const { EventsHandler   } = await import(eventsHandlerPath  );
const { ModuleHandler   } = await import(moduleHandlerPath  );

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	]
});
const commandsHandler = new CommandsHandler();
client.commands = commandsHandler.getCmds();
commandsHandler.globalCmdUpdate(client);

const eventsHandler = new EventsHandler();
eventsHandler.getEvents(client);

const configHandler = new ConfigHandler();
const token = configHandler.getConfigValue('app_settings.token');

const moduleHandler = new ModuleHandler();
moduleHandler.getModules();

if(typeof token !== 'undefined') {
	client.login(token);
	console.log(`User is ${client.user}`);
}
else {
	console.error('config value \'app_settings.token\' is undefined.');
}

