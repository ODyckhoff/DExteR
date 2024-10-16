import path from 'node:path';
import fs from 'node:fs';
import { parse } from 'acorn';
import { resolveAPU } from '@utils/resolveAPU.js';
import { IHandler } from '@lib/IHandler.js';

class ModuleHandler extends IHandler {
	constructor(client) {
		super(client);
	}

	getAvailableModules() {
		return this.availableFiles;
	}

	validateFile( filePath ) {
		return true;
	}


}
export { ModuleHandler };

