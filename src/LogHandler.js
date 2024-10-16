import path from 'node:path';
import fs from 'node:fs';
import chalk from 'chalk';
import { ConfigHandler } from '@src/ConfigHandler.js';

class LogHandler {
	constructor() {
	}

	static debug(text) {

	}

	static warn(text) {

	}

	static error(text) {

	}

	async log(message, level = 'info', moduleName, interaction = null) {
		const logColors = {
			info: chalk.blueBright,
			debug: chalk.reset,
			warn: chalk.yellow,
			error: chalk.red,
			success: chalk.green
		}
		const configHandler = new ConfigHandler();
		const logConfig = await configHandler.getConfigValue('log_settings');

		if(logConfig.fileEnabled) {
			const filePath = logConfig.fileSettings.path;
		}

		const formattedMessage = this.formatMessage(message, level, moduleName, interaction);
		console.log(logColors[level](formattedMessage));
	}

	formatMessage(message, level, moduleName, interaction) {
		const datetime = new Date();
		const [year, month, day, hour, min, sec] = [
			datetime.getFullYear(),
			("0" + (datetime.getMonth() + 1)).slice(-2),
			("0" + datetime.getDate()).slice(-2),
			("0" + datetime.getHours()).slice(-2),
			("0" + datetime.getMinutes()).slice(-2),
			("0" + datetime.getSeconds()).slice(-2)
		];
		const formattedDateTime = `${year}/${month}/${day} ${hour}:${min}:${sec}`
			
		return `[${formattedDateTime}] [${level.toUpperCase()}] ${moduleName ? `(${moduleName}) ` : ''}${message} ${interaction ? `(User: ${interaction.user.tag}, Guild: ${interaction.guild.name})` : '' }`;
	}
}

export { LogHandler };
