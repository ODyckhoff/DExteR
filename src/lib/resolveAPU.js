import { fileURLToPath, pathToFileURL } from 'node:url';

export function resolveAPU( pathOrURL, wanted ) {
	try {
		if(typeof pathOrURL === 'undefined' || typeof wanted === 'undefined' ) {
			const error = `One or more arguments to resolveAPU( pathOrURL, wanted ) is undefined.`;
			console.error( 'Error:', error );
			throw new Error( error );
		}
		switch(wanted) {
			case "path":
				if(typeof pathOrURL === 'string' && ! pathOrURL.startsWith('@')) {
					//console.log('Path provided, path needed, no change.');
					return pathOrURL;
				}
				else if(typeof pathOrURL === 'string' && pathOrURL.startsWith('@')) {
					//console.log('String module alias provided, path needed, converting.');
					return fileURLToPath( import.meta.resolve( pathOrURL ) );
				}
				else if( pathOrURL instanceof URL && pathOrURL.protocol === 'file:' ) {
					//console.log('File URL provided, path needed, converting.');
					return fileURLToPath( pathOrURL );
				}
				else {
					const error = `No path, module-alias or File URL provided. Input: '${pathOrURL}'.`;
					console.error('Error:', error);
					throw new Error( error );
				}
				break;
			case "URL":
				if( typeof pathOrURL === 'string' && ! pathOrURL.startsWith('@')) {
					//console.log('Path provided, File URL needed, converting.');
					return pathToFileURL( pathOrURL );
				}
				else if( typeof pathOrURL === 'string' && pathOrURL.startsWith('@')) {
					//console.log('String module alias provided, File URL needed, converting.');
					return import.meta.resolve( pathOrURL );
				}
				else if( pathORURL instanceof URL && pathOrURL.protocol === 'file:' ) {
					//console.log('File URL provided, File URL needed, no change.');
					return pathOrURL;
				}
				else {
					const error = `No path, module-alias or File URL provided. Input: '${pathOrURL}'.`;
					console.error('Error:', error);
					throw new Error( error );
				}
				break;
		}
	}
	catch ( error ) {
		console.error('Error occurred whilst attempting to resolve Alias, Path, or File URL:', error);
	}
}

