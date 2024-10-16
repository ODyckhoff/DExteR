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
console.log("DEXTER is a Discord EXTEndable Robot - Created to allow cutom modules to be used for any Discord Guilds!");
console.log();
console.log("[LOG] This is what a console.log looks like.");
console.warn("[WARN] This is what a console.warn looks like.");
console.error("[ERROR] This is what a console.error looks like.");
console.log();
console.log(chalk.green("Starting DEXTER..."));
console.log(chalk.green("=================="));
import path from 'path';
import { fileURLToPath } from 'node:url';
import { Client, Collection, GatewayIntentBits } from 'discord.js';

const { ConfigHandler   } = await import('@src/ConfigHandler.js');
const { CommandsHandler } = await import('@src/CommandsHandler.js');
const { EventsHandler   } = await import('@src/EventsHandler.js');
const { ModuleHandler   } = await import('@src/ModuleHandler.js');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	]
});
const commandsHandler = new CommandsHandler(client);
try {
	const commands = await commandsHandler.getFiles('commands');
	const commandsMap = await commandsHandler.loadFiles( commands );
}
catch( err ) {
	console.error( err );
}

	//await commandsHandler.globalCmdUpdate( client );
	//console.dir(client.commands, {depth:null});

//const moduleHandler = new ModuleHandler();
//try {
//    const modules = moduleHandler.getFiles('modules');
//    const modulesMap = moduleHandler.loadFiles( modules );
//}
//catch( moduleError ) {
//	console.error('Error loading modules: ', moduleError);
//}

const eventsHandler = new EventsHandler(client);
try {
	const events = await eventsHandler.getFiles('events');
	const eventsMap = await eventsHandler.loadFiles( events );
	eventsHandler.registerEvents(client, eventsMap, commandsHandler);
}
catch( err ) {
	console.error( err );
}

const configHandler = new ConfigHandler();
try {
    const token = await configHandler.getConfigValue('app_settings.token');

    if(typeof token !== 'undefined') {
        client.login(token);
    }
    else {
        console.error('config value \'app_settings.token\' is undefined.');
    }
}
catch( error ) {
	console.error('Error loading token from config file: ', error);
}

