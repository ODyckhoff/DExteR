//import path from 'node:path';
import { SlashCommandBuilder } from 'discord.js';
//import { resolveAPU } from '@lib/resolveAPU.js';
import { DatabaseHandler } from '@src/DatabaseHandler.js';
import { ModuleHandler } from '@src/ModuleHandler.js';
import { ICommand } from '@lib/ICommand.js';

//const moduleHandler = new ModuleHandler();
//const availableModules = moduleHandler.getAvailableModules();

class CommandBotSetup extends ICommand {

	constructor() {
		super();
	}

	get version() {
		return '0.9a';
	}

	get data() {
		return this.#createSlashCommand();
	}

	async execute(interaction, moduleHandler) {
		console.log("Bot Setup Command triggered");
		const databaseHandler = new DatabaseHandler();
		// Authorization check: Allow server administrators OR users with the admin role
		const adminRoleId = this.#getBotAdminRole(interaction.guild.id); 
		if (
			!interaction.member.permissions.has('ADMINISTRATOR') && 
			!interaction.member.roles.cache.has(adminRoleId)
		) {
			console.warn("User is not authorised to use this command");
			return interaction.reply({ 
				content: 'You need administrator permissions or the designated BotAdmin role to manage modules.',
				ephemeral: true 
			});
		}
		console.log("User is authorised to use this command");

		const subcommand = interaction.options.getSubcommand();
		const subcommandgroup = interaction.options.getSubcommandGroup();
		console.log(`Subcommand fetched: ${subcommand}`);
	
		if (subcommand === 'adminrole') {
			console.log("adminrole subcommand triggered");
			// Handle admin role update
			const adminRole = interaction.options.getRole('adminrole');
	
			// Authorization check: Only allow server administrators to set the admin role
			if (!interaction.member.permissions.has('ADMINISTRATOR')) {
				return interaction.reply({ 
					content: 'You need administrator permissions to set the admin role.',
					ephemeral: true 
				});
			}
	
			// Store/update the admin role ID in the database
			if(adminRoleId === null) {
				const query = `
					INSERT INTO guild_settings (guild_id, admin_role_id) 
					VALUES (?, ?) 
					ON DUPLICATE KEY UPDATE admin_role_id = ?
				`;
				await databaseHandler.queryDatabase(query, [interaction.guild.id, adminRole.id, adminRole.id]);
			}
			else {
				const query = `
					UPDATE guild_settings
					SET admin_role_id = ?
					WHERE guild_id = ?;
				`;
				await databaseHandler.queryDatabase(query, [adminRole.id, interaction.guild.id]);
			}
	
			await interaction.reply(`Bot setup complete! The admin role is now set to ${adminRole}.`);
		} else if (subcommandgroup === 'module') {
			console.log("module subcommand group triggered");
			const action = subcommand;
			if(action === 'list') {
				console.log("module list subcommand triggered");
				console.dir(moduleHandler, {depth:null});
				const moduleList = Array.from(moduleHandler.availableInstances.keys()).join('\n*');

				await interaction.reply({
					content: `## Available modules:\n* ${moduleList}`,
					ephemeral: true
				});
			} else {
				const moduleName = interaction.options.getString('module_name');
				try {
					console.log(`module subcommand with module_name argument triggered: ${moduleName}`);
					const module = availableModules.find(m => m.name === moduleName);
					if (!module) {
						console.error('Module not found');
						return interaction.reply({ content: 'Module not found.', ephemeral: true });
					}
					if (action === 'enable') {
						console.log("Module enable");
						await module.module.start(interaction.client, interaction.guild);
						module.enabled = true;
						await interaction.reply(`Module '${moduleName}' enabled.`);
					} else if (action === 'disable') {
						console.log("Module disable");
						await module.module.stop(interaction.client, interaction.guild);
						module.enabled = false;
						await interaction.reply(`Module '${moduleName}' disabled.`);
					} else if (action === 'status') {
						console.log("Module status");
						const status = module.enabled ? 'Enabled' : 'Disabled';
						await interaction.reply(`Module '${moduleName}' is currently ${status}.`);
					}
				} catch (error) {
					console.error(`Error ${action}ing module '${moduleName}':`, error);
					await interaction.reply({
						content: `Failed to ${action} module '${moduleName}'. Check console for details.`,
						ephemeral: true
					});
				}
			}
		} 

	}

	async #getBotAdminRole(guildId) {
		const databaseHandler = new DatabaseHandler();
		const query = 'SELECT admin_role_id FROM guild_settings WHERE guild_id = ?';
		const rows = await databaseHandler.queryDatabase(query, [guildId]);
		if (rows.length > 0) {
			return rows[0].admin_role_id;
		} else {
			return null; 
		}
	}

	#createSlashCommand() {
		return new SlashCommandBuilder()
		        .setName('dexter-admin')
		        .setDescription('configure bot settings')
			.addSubcommand(subcommand =>
				subcommand.setName('adminrole')
					.setDescription('Set the admin role for the bot')
		        		.addRoleOption(option =>
		            			option.setName('adminrole')
		                			.setDescription('The role that can manage bot settings')
		        		)
			)
		        .addSubcommandGroup(group => // Chain .addSubcommandGroup directly to SlashCommandBuilder
		            group.setName('module')
		                .setDescription('Manage bot modules')
		                .addSubcommand(subcommand =>
		                    subcommand.setName('enable')
		                        .setDescription('Enable a module')
		                        .addStringOption(option =>
		                            option.setName('module_name')
		                                .setDescription('The name of the module')
		                                .setRequired(true)
						.setAutocomplete(true)
		                        )
		                )
		                .addSubcommand(subcommand =>
		                    subcommand.setName('disable')
		                        .setDescription('Disable a module')
		                        .addStringOption(option =>
		                            option.setName('module_name')
		                                .setDescription('The name of the module')
		                                .setRequired(true)
		                        )
		                )
		                .addSubcommand(subcommand =>
		                    subcommand.setName('status')
		                        .setDescription('Current status of module')
		                        .addStringOption(option =>
		                            option.setName('module_name')
		                                .setDescription('The name of the module')
		                                .setRequired(true)
		                        )
		                )
		                .addSubcommand(subcommand =>
		                    subcommand.setName('list')
		                        .setDescription('List currently available modules')
		                )
			);
	}

	async handleAutocomplete(interaction) {
		if(interaction.commandName === 'botsetup' &&
			interaction.options.getSubcommand() === 'module' &&
			interaction.options.getFocused(true).name === 'module_name') {

			const focusedValue = interaction.options.getFocused();
			const filtered = availableModules.filter(choice => choice.startsWith(focusedValue));
			await interaction.respond(
				filtered.map(choice => ({ name: choice, value: choice })),
			);
		}
	}
}

export { CommandBotSetup } 
