import path from 'path';
import { Events } from 'discord.js';

const commandsHandlerPath = path.join(global.__rootdir, '/src/CommandsHandler.js');
const { CommandsHandler } = await import(commandsHandlerPath);

export default {
    name: Events.InteractionCreate,
    async execute(interaction) {
        const commandsHandler = new CommandsHandler();
        commandsHandler.handleInteraction(interaction);
    }
};
