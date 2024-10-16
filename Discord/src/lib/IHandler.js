class IHandler {
	constructor() {
		if( this.constructor.name === 'IHandler' ) {
			throw new Error( "'IHandler' is an abstract class and cannot be instantiated." );
		}
	}

	async getFiles( handlerType ) {
		// e.g. if CommandsHandler, handlerType would be 'commands',
		// this would load .js files from `/src/@${handlerType}/`
		// Returns a list of available file paths.
		
		const handlerDir = resolveAPU( `@${ handlerType.toLowerCase() }` );

		function getFilesRecursively( directoryPath ) {
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
						getFilesRecursively( entryPath )
					);
				}
				else if( entry.isFile() && entry.name.endsWith( '.js' ) ) {
					files.push( entryPath );
				}
			}
			return files;
		}

		const allFiles = getFilesRecursively( handlerDir );
		const validFiles = allFiles.filter( file => this.validateFileContent( file ) );
		return validFiles;
	}

	async loadFiles( filePaths ) {
		// takes a list of file paths, attempts to import and instantiate.
		// Returns a Map of the file names and the class instances.
	
	}

	validateFileContent( filePath ) {
		const err = "Method 'validateFileContent()' must be implemetned.";
		console.error( err );
		throw new Error( err );
	}
}

