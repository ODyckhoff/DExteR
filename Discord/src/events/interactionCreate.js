import path from 'path';
import { Events } from 'discord.js';
import { resolveAPU } from '@utils/resolveAPU.js';

const commandsHandlerPath = resolveAPU('@src/CommandsHandler.js', 'path');
const { CommandsHandler } = await import(commandsHandlerPath);

export default {
    name: Events.InteractionCreate,
    async execute(interaction) {
        const commandsHandler = new CommandsHandler();
        commandsHandler.handleInteraction(interaction);
    }
};
