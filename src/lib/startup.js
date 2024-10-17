import fs from 'node:fs';
import { exec } from 'node:child_process';
import { resolveAPU } from '@utils/resolveAPU.js';

class StartUp {
	constructor(logHandler) {
		this.logHandler = logHandler;
	}

	async check() {
		console.log('Check one two, check one two');
		if(this.isFirstTimeRun()) {
			await this.runSetup();
		}
	}

	isFirstTimeRun() {
		const result = fs.existsSync(resolveAPU('@root/.setup-complete', 'path'));
		console.log(result);
		return !result;
	}

	async runSetup() {
		this.logHandler.log('Looks like this is the first time running, initiating setup', 'info');
		this.logHandler.log('Installing NodeJS dependencies...', 'info');
		await new Promise((resolve, reject) => {
			exec('npm install', (error, stdout, stderr) => {
				if(error) {
					this.logHandler.log(`Problem installing dependencies: ${error}`, 'error', 'StartUp');
					reject(error);
				}
				else {
					console.log(stdout);
					this.logHandler.log('NodeJS dependencies installed', 'success');
					resolve();
				}
			});
		});

		fs.writeFileSync(resolveAPU('@root/.setup-complete', 'path'), '');
		this.logHandler.log('Setup Complete!', 'success');
	}
}

export { StartUp }

