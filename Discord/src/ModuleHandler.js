import path from 'node:path';
import fs from 'node:fs';
import { parse } from 'acorn';

class ModuleHandler {
	constructor() {
		this.loadedModules = new Map();
	}

	getModules() {
		const modules = [];

		const moduleDirPath = path.join(global.__rootdir, 'src/modules');
		const moduleDirs = fs.readdirSync(moduleDirPath, { withFileTypes: true })
			.filter(dirent => dirent.isDirectory())
			.map(dirent => dirent.name);

		for (const moduleName of moduleDirs) {
			const modulePath = path.join(moduleDirPath, moduleName);
			const indexPath = path.join(modulePath, 'index.js');

			if(fs.existsSync(indexPath)) {
				if(this.#validateModuleIndex(indexPath, moduleName)) {
					modules.push(moduleName);
				}
			}
			else {
				console.warn(`Module '${moduleName}' is missing an index.js file.`);
			}
		}
	}

	#validateModuleIndex(file, moduleName) {
		const moduleCode = fs.readFileSync(file, 'utf8');

		try {
			const ast = parse(moduleCode, { ecmaVersion: 'latest', sourceType: 'module' });
			const exportDefaultDeclaration = ast.body.find(
				node => node.type === 'ExportDefaultDeclaration'
			);

			if(exportDefaultDeclaration) {
				const exportedObject = exportDefaultDeclaration.declaration;

				const hasStartMethod = exportedObject.properties.some(
					prop => prop.key.name === 'start' && prop.value.type === 'FunctionExpression'
				);

				const hasStopMethod = exportedObject.properties.some(
					prop => prop.key.name === 'stop' && prop.value.type === 'FunctionExpression'
				);

				if(hasStartMethod && hasStopMethod) {
					return true;
				}
				else {
					console.warn(`Module '${moduleName}' doesn't have the required 'start' and 'stop' methods.`);
					return false;
				}
			}
			else {
				console.warn(`Module '${moduleName}' doesn't have a default export.`);
				return false;
			}
		}
		catch (error) {
			console.error(`Error parsing module '${moduleName}':`, error);
			return false;
		}
	}

	async loadModule(moduleName) {
		if(this.loadedModules.has(moduleName)) {
			return this.loadedModules.get(moduleName);
		}

		try {
			const modulePath = path.join(global.__rootdir, 'src/modules', moduleName, 'index.js');
			const moduleClass = (await import(modulePath)).default;
			const moduleInstance = new moduleClass();

			moduleInstance.start();
			this.loadedModules.set(moduleName, moduleInstance);
			return moduleInstance;
		}
		catch (error) {
			console.error(`Error loading module ${moduleName}:`, error);
		}
	}
}

export { ModuleHandler };

