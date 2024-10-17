console.clear();

import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
register("esm-module-alias/loader", pathToFileURL("./"));

import chalk from 'chalk';

console.log("Welcome to DEXTER!");
console.log("-.. . -..- - . .-.");
console.log('');
console.log("8 888888888o.      8 8888888888   `8.`8888.      ,8' 8888888 8888888888 8 8888888888   8 888888888o.   ");
console.log("8 8888    `^888.   8 8888          `8.`8888.    ,8'        8 8888       8 8888         8 8888    `88.  ");
console.log("8 8888        `88. 8 8888           `8.`8888.  ,8'         8 8888       8 8888         8 8888     `88  ");
console.log("8 8888         `88 8 8888            `8.`8888.,8'          8 8888       8 8888         8 8888     ,88  ");
console.log("8 8888          88 8 888888888888     `8.`88888'           8 8888       8 888888888888 8 8888.   ,88'  ");
console.log("8 8888          88 8 8888             .88.`8888.           8 8888       8 8888         8 888888888P'   ");
console.log("8 8888         ,88 8 8888            .8'`8.`8888.          8 8888       8 8888         8 8888`8b       ");
console.log("8 8888        ,88' 8 8888           .8'  `8.`8888.         8 8888       8 8888         8 8888 `8b.     ");
console.log("8 8888    ,o88P'   8 8888          .8'    `8.`8888.        8 8888       8 8888         8 8888   `8b.   ");
console.log("8 888888888P'      8 888888888888 .8'      `8.`8888.       8 8888       8 888888888888 8 8888     `88. ");
console.log("");
console.log("DEXTER is a Discord EXTEndable Robot - Created to allow custom modules to be used for any Discord Guilds!");
console.log();
console.log(chalk.green("Initialising DEXTER..."));
console.log(chalk.green("======================"));
import path from 'path';
import { fileURLToPath } from 'node:url';
import { Client, Collection, GatewayIntentBits } from 'discord.js';

const { ConfigHandler   } = await import('@src/ConfigHandler.js');
const { LogHandler      } = await import('@src/LogHandler.js');
const { CommandsHandler } = await import('@src/CommandsHandler.js');
const { EventsHandler   } = await import('@src/EventsHandler.js');
const { ModuleHandler   } = await import('@src/ModuleHandler.js');
const { StartUp } = await import('@lib/startup.js');

const logHandler = new LogHandler();
logHandler.log("DExteR has been started.", 'info', 'index.js');

const startUp = new StartUp(logHandler);
await startUp.check();

process.on('SIGTERM', () => {
    logHandler.log("DExteR has received SIGINT from system, exiting,", 'info', 'SYSTEM');
    process.exit();
});

logHandler.log("Loading Core Config...", 'info', 'core');
const configHandler = new ConfigHandler();
logHandler.log("Loaded Config.", 'success');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	]
});
logHandler.log("Loading Commands...", 'info', 'core');
const moduleHandler = new ModuleHandler();
const commandsHandler = new CommandsHandler(client, moduleHandler);
try {
	const commands = await commandsHandler.getFiles('commands');
	const commandsMap = await commandsHandler.loadFiles( commands );
}
catch( err ) {
	logHandler.log(err, 'error', 'CommandsHandler');
}
logHandler.log("Commands Loaded", 'success');

	//await commandsHandler.globalCmdUpdate( client );
	//console.dir(client.commands, {depth:null});

logHandler.log("Loading Modules...", 'info', 'core');
try {
    const modules = await moduleHandler.getFiles('modules');
    console.dir(modules, {depth:null});
    const modulesMap = moduleHandler.loadFiles( modules );
}
catch( moduleError ) {
	logHandler.log(moduleError, 'error','ModuleHandler');
}
logHandler.log('Loaded Modules.', 'success');

logHandler.log("Loading Events...", 'info', 'core');
const eventsHandler = new EventsHandler(client);
try {
	const events = await eventsHandler.getFiles('events');
	const eventsMap = await eventsHandler.loadFiles( events );
	eventsHandler.registerEvents(client, eventsMap, commandsHandler);
}
catch( err ) {
	logHandler.log(err, 'error', 'EventsHandler');
	console.error( err );
}
logHandler.log("Loaded Events", 'success');

try {
    const token = await configHandler.getConfigValue('app_settings.token');

    if(typeof token !== 'undefined') {
        client.login(token);
    }
    else {
        logHandler.log('config value \'app_settings.token\' is undefined.', 'error', 'ConfigHandler');
    }
}
catch( error ) {
	logHandler.log(error, 'error', 'ConfigHandler');
}

