import path from 'node:path';
import fs from 'node:fs';
import { Client, Collection } from 'discord.js';

class CommandsHandler {
    constructor() {

    }

    getCmds() {
        this.commands = new Collection();

        const foldersPath = path.join(global.__rootdir, '/src/commands');
        const commandFolders = fs.readdirSync(foldersPath);
        this.#getFolders(commandFolders);
  
        return this.commands;
    }

    #getFolders(commandFolders) {
        for(const folder of commandFolders) {
            const commandsPath = path.join(global.__rootdir, '/src/commands', folder);
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
            this.#getFiles(commandFiles, commandsPath);
        }
    }

    #getFiles(commandFiles, commandsPath) {
        for(const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
                const command = require(filePath);

                // Check file is valid
                if(this.#isCommandValid(command)) {
                    this.commands.set(command.data.name, command);
                }
                else {
                    console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                }
        }
    }

    async handleInteraction(interaction) {
        if(!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if(!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            await interaction.followUp({ content: `No command matching ${interaction.commandName} was found.` });
            return;
        }

        try {
            await command.execute(interaction);
        }
        catch (error) {
            console.error(`Error executing command ${interaction.commandName}: ${error}`);
            if(interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: `There was an error whilst executing ${interaction.commandName}!`, ephemeral: true });
            }
            else {
                await interaction.reply({ content: `There was an error whilst executing ${interaction.commandName}!`, ephemeral: true });
            }
        }

    }

    guildCmdUpdate() {

    }

    globalCmdUpdate() {

    }

    #isCommandValid(command) {
        return ('data' in command && 'execute' in command);
    }
}