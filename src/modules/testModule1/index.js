//import path from 'node:path';
//import { resolveAPU } from '@lib/resolveAPU.js';
//import { DatabaseHandler } from '@src/DatabaseHandler.js';
//import { ModuleHandler } from '@src/ModuleHandler.js';
import { IModule } from '@lib/IModule.js';

class ModuleTestModule1 extends IModule {

	constructor() {
		super();
	}

	get version() {
		return '0.9a';
	}

	get data() {
		return [];
	}

	async execute(interaction) {
		
	}

	async handleAutocomplete(interaction) {
		
	}
}

export { ModuleTestModule1 } 
