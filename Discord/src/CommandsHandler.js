import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import chalk from 'chalk';
import { Collection } from 'discord.js';

import { resolveAPU } from '@utils/resolveAPU.js';

class CommandsHandler {
    constructor() {

    }

    getCmds() {
        this.commands = new Collection();

        const commandFolders = fs.readdirSync(resolveAPU('@commands', 'path'));
        this.#getFolders(commandFolders);
  
        return this.commands;
    }

    #getFolders(commandFolders) {
        for(const folder of commandFolders) {
            const commandPath = resolveAPU('@commands', 'path');
            const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));
            this.#getFiles(commandFiles, commandPath);
        }
    }

    #getFiles(commandFiles, commandPath) {
        for(const file of commandFiles) {
            const filePath = path.join(commandPath, file);
                import(filePath).then(commandModule => {
			if(typeof commandModule.default === 'function') {
				const command = commandModule.default();
                		if(this.#isCommandValid(command)) {
                		    this.commands.set(command.data.name, command);
                		}
                		else {
                   		 console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                		}
				this.commands.set(command.data.name, command);
			}
			else {
				console.error(`[ERROR] Invalid command module: ${file}. Default export must be a function.`);
			}
		});

                // Check file is valid
        }
    }

    async handleInteraction(interaction) {
        if(!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if(!command) {
            console.error(`[ERROR] No command matching ${interaction.commandName} was found.`);
            await interaction.followUp({ content: `No command matching ${interaction.commandName} was found.` });
            return;
        }

        try {
            await command.execute(interaction);
        }
        catch (error) {
            console.error(`[ERROR] Error executing command ${interaction.commandName}: ${error}`);
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

    async globalCmdUpdate(client) {
	try {
		console.log('Started refreshing application global (/) commands.');

		const commandPath = resolveAPU('@commands', 'path');
		const commandFiles = fs.readdirSync(commandPath).filter( file =>
			file.endsWith('js')
		);

		const commands = [];

		for (const file of commandFiles) {
			const filePath = path.join(commandPath, file);
			const commandModule = await import(filePath);
			const command = commandModule.default();
			commands.push(command.data.toJSON());
		}

		await client.application?.commands.set(commands);

		console.log(chalk.green(`Successfully reloaded ${commands.length} application global (/) commands.`));
	}
	catch (error) {
		console.error('Error reloading application (/) commands:', error);
	}
    }

    #isCommandValid(command) {
        return ('data' in command && 'execute' in command);
    }
}

export { CommandsHandler };
