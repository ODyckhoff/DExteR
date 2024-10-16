console.clear();

import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
register("esm-module-alias/loader", pathToFileURL("./"));

import chalk from 'chalk';

console.log("Welcome to dbot!");
console.log("");
console.log("[LOG] This is what a console.log looks like.");
console.warn("[WARN] This is what a console.warn looks like.");
console.error("[ERROR] This is what a console.error looks like.");

import path from 'path';
import { fileURLToPath } from 'node:url';
import { Client, Collection, GatewayIntentBits } from 'discord.js';

const { ConfigHandler   } = await import('@src/ConfigHandler.js');
const { CommandsHandler } = await import('@src/CommandsHandler.js');
const { EventsHandler   } = await import('@src/EventsHandler.js');
//const { ModuleHandler   } = await import('@src/ModuleHandler.js');

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
	console.log("TOKEN BELOW");
	console.log("===========");
	console.log(token);
	console.log("===========");
        client.login(token);
    }
    else {
        console.error('config value \'app_settings.token\' is undefined.');
    }
}
catch( error ) {
	console.error('Error loading token from config file: ', error);
}



/*
const moduleHandler = new ModuleHandler();
moduleHandler.getModules();
*/

