import fs  from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'node:url';
import { Client, Collection, Presence, GatewayIntentBits } from 'discord.js';
import { error } from 'node:console';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname);
global.__rootdir = rootDir;

const commandsHandlerPath = path.join(global.__rootdir, '/src/CommandsHandler.js');
const eventsHandlerPath = path.join(global.__rootdir, '/src/EventsHandler.js');

const { CommandsHandler } = await import(commandsHandlerPath);
const { EventsHandler } = await import(eventsHandlerPath);

let token;
await import(path.join(global.__rootdir, 'config.json'), { assert: { type: 'json' }})
    .then(config => {
        token = config.token
        console.log(typeof token);
        const client = new Client({ intents: [GatewayIntentBits.Guilds]});

        const commandsHandler = new CommandsHandler();
        client.commands = commandsHandler.getCmds();

        const eventsHandler = new EventsHandler();
        eventsHandler.getEvents(client);

        client.login(token);

    })
    .catch(error => {
        console.error('Error loading config.json', error);
    });
