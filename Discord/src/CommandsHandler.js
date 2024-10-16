import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import chalk from 'chalk';
import { Collection } from 'discord.js';
import { resolveAPU } from '@utils/resolveAPU.js';
import { IHandler } from '@lib/IHandler.js';
import { parse } from 'acorn';
import { ConfigHandler } from '@src/ConfigHandler.js';

class CommandsHandler extends IHandler {
    constructor(client) {
	super(client);
    }

    validateFile( filePath ) {
	    const moduleCode = fs.readFileSync(filePath, 'utf-8');

	    try {
		    const ast = parse( moduleCode, { ecmaVersion: 'latest', sourceType: 'module' });
		    const exportNamedDeclaration = ast.body.find(
			    node => node.type === 'ExportNamedDeclaration' &&
			            node.specifiers &&
			    	    node.specifiers.length > 0 &&
			    	    node.specifiers[0].exported.type === 'Identifier'
		    );

		    if(!exportNamedDeclaration) {
			    console.error(`No named export found in ${filePath}`);
			    return false;
		    }
		    const exportedClassName = exportNamedDeclaration.specifiers[0].exported.name;

		    const classDeclaration = ast.body.find(
			    node => node.type === 'ClassDeclaration' &&
			    	    node.id.name === exportedClassName
		    );
		    if(! classDeclaration ) {
			    console.error(`Not a class in ${filePath}`);
			    return false;
		    }

		    const extendsICommand = classDeclaration.superClass && classDeclaration.superClass.name === 'ICommand';
		    if(! extendsICommand ) {
			    console.error(`${filePath} Does not extend ICommand`);
			    return false;
		    }

		    const hasExecuteMethod = classDeclaration.body.body.some(
			    method => method.type === 'MethodDefinition' &&
			    	      method.key.name === 'execute' &&
			    	      method.kind === 'method'
		    );
		    if(! hasExecuteMethod ) {
			    console.error(`${filePath} Does not implement execute method`);
			    return false;
		    }

		    const hasDataGetter = classDeclaration.body.body.some(
			    method => method.type === 'MethodDefinition' &&
			    	      method.key.name === 'data' &&
			    	      method.kind === 'get'
		    );
		    if(! hasDataGetter ) {
			    console.error(`${filePath} Does not have a get data() method`);
			    return false;
		    }

		    const hasVersionGetter = classDeclaration.body.body.some(
			    method => method.type === 'MethodDefinition' &&
			    	      method.key.name === 'version' &&
			    	      method.kind === 'get'
		    );
		    if(! hasVersionGetter ) {
			    console.error(`${filePath} Does not have a get version() method`);
			    return false;
		    }

		    return true;
	    }
	    catch( err ) {
		    console.error(`Error parsing command file ${filePath}:`, err);
		    return false;
	    }
    }

    async handleInteraction(interaction) {
        if(!interaction.isChatInputCommand()) return;

	console.log("Attepting to print interaction.client.commands");
	//console.dir(interaction.client.commands, {depth:null});
	console.log("END");
        const command = interaction.client.commands.get(interaction.commandName);

        if(!command) {
            console.error(`[ERROR] No command matching ${interaction.commandName} was found.`);
            await interaction.reply({ content: `No command matching ${interaction.commandName} was found.` });
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

	// First we need to check if any commands actually need updating.
	//const storedCommands = await getGlobalCommands();

	try {
		client.commands = new Collection();
		//console.dir(this.availableInstances, {depth:null});
		console.log('Started refreshing application global (/) commands.');
		const commands = [];

		for( const [commandName, { instance: command }] of this.availableInstances) {
			const commandData = command.data.toJSON();
			//console.dir(commandData, { depth: null });
			//if(!inthestoredcommandsarray) {
				commands.push(command.data.toJSON());
				client.commands.set(command.data.name, command);
			//}
		}

		//console.dir(commands, { depth: null});

		await client.application?.commands.set(commands);
		//updatecommandsinthearray();

		console.log(chalk.green(`Successfully reloaded ${commands.length} application global (/) commands.`));
	}
	catch (error) {
		console.error('Error reloading application (/) commands:', error);
	}
    }

    getGlobalCommands() {
	const commandsHandler = new CommandsHandler('src/commands/globalcommands.json');
	return commandsHandler.config;
    }

    storeGlobalCommands() {

    }

    #isCommandValid(command) {
        return ('data' in command && 'execute' in command);
    }
}

export { CommandsHandler };
