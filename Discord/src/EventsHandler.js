import fs from 'node:fs';
import path from 'node:path';
import { resolveAPU } from '@utils/resolveAPU.js';
import { IHandler } from '@lib/IHandler.js';
import { parse } from 'acorn';

class EventsHandler extends IHandler {
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

		const extendsIEvent = classDeclaration.superClass && classDeclaration.superClass.name === 'IEvent';
		if(! extendsIEvent ) {
			console.error(`${filePath} does not extend IEvent`);
			return false;
		}

		const hasExecuteMethod = classDeclaration.body.body.some(
			method => method.type === 'MethodDefinition' &&
				  method.key.name === 'execute' &&
				  method.kind === 'method'
		);
		if(! hasExecuteMethod ) {
			console.error(`${filePath} does not implement execute method`);
			return false;
		}

		const hasVersionGetter = classDeclaration.body.body.some(
			method => method.type === 'MethodDefinition' &&
				  method.key.name === 'version' &&
				  method.kind === 'get'
		);
		if(! hasVersionGetter ) {
			console.error(`${filePath} does not have a get version() method`);
			return false;
		}

		const hasOnceGetter = classDeclaration.body.body.some(
			method => method.type === 'MethodDefinition' &&
				  method.key.name === 'once' &&
				  method.kind === 'get'
		);
		if(! hasVersionGetter ) {
			console.error(`${filePath} does not have a get once() method`);
			return false;
		}

		return true;
	    }
	    catch(err) {
    		console.error(`Error parsing event file ${filePath}:`, err);
		return false;
	    }
    }

    registerEvents(client, eventsMap) {
	    console.log('Registering Events');
	    console.dir(this.availableInstances, {depth:null});
	    for(const [eventName, { instance: event }] of eventsMap) {
		    console.log("doing stuff in for loop");
		    console.log('ClassName: ' + eventName);
		    console.log('Discord Event Name: ' + event.name);
		    console.dir(event, {depth: null});
		    if(event.once) {
			    console.log('Registering "once" event EventReady');
			    client.once(event.name, (...args) => {
				    event.execute(...args);
				    console.log(`Executing event: ${eventName}`);
			    });
		    }
		    else {
			    client.on(event.name, (...args) => event.execute(...args));
		    }
	    }
    }
}

export { EventsHandler };

