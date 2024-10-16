import { Events } from 'discord.js';
import { CommandsHandler } from '@commands/CommandsHandler.js';

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        const commandsHandler = new CommandsHandler();
        commandsHandler.handleInteraction(interaction);
    }
}