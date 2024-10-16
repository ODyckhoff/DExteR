import fs from 'node:fs';
import path from 'node:path';
import { resolveAPU } from '@lib/resolveAPU.js'

class IHandler {
	constructor(client) {
		if( this.constructor.name === 'IHandler' ) {
			throw new Error( "'IHandler' is an abstract class and cannot be instantiated." );
		}

		this.client = client;
		this.availableFiles = [];
		this.availableInstances = new Map();
	}

	async getFiles( handlerType ) {
		// e.g. if CommandsHandler, handlerType would be 'commands',
		// this would load .js files from `/src/@${handlerType}/`
		// Returns a list of available file paths.
		
		const handlerDir = resolveAPU( `@${ handlerType.toLowerCase() }`, 'path' );
		const allFiles = this.getFilesRecursively( handlerDir );

		try {
		    const validFiles = allFiles.filter( file => this.validateFile( file ) );
		    this.availableFiles = validFiles;
		    return validFiles;
		}
		catch( validationError ) {
			console.error("Validation Error:", validationError );
		}
	}

	getFilesRecursively( directoryPath ) {
		let files = [];

		const entries = fs.readdirSync( directoryPath, 
			{ withFileTypes: true }
		);
	
		for( const entry of entries ) {
			const entryPath = path.join(
				directoryPath,
				entry.name
			);
			if( entry.isDirectory() ) {
				files = files.concat(
					this.getFilesRecursively( entryPath )
				);
			}
			else if( entry.isFile() && entry.name.endsWith( '.js' ) ) {
				files.push( entryPath );
			}
		}
		return files;
	}

	async loadFiles( filePaths ) {
		// takes a list of file paths, attempts to import and instantiate.
		// Returns a Map of the file names and the class instances.
		const instances = new Map();
		for ( const file of filePaths ) {
			try {
				const module = await import(file);
				const [exportedClassName, exportedClass] = Object.entries(module)[0];
				const instance = new exportedClass();
				instances.set(exportedClassName, { instance, version: instance.version });
			}
			catch( err ) {
				console.error (err );
			}
		}
		this.availableInstances = instances;
		return instances;
	}

	validateFile( filePath ) {
		const err = "Method 'validateFile()' must be implemented.";
		console.error( err );
		throw new Error( err );
	}
}

export { IHandler }

