class IEvent {

	constructor() {
		if(this.constructor.name === 'IEvent') {
			throw new Error("IEvent is an abstract class and cannot be instantiated.");
		}
	}

	get name() {
		throw new Error("Property 'name' must be implemented.");
	}

	get version() {
		throw new Error("Property 'version' must be implemented.");
	}

	async execute() {
		throw new Error("The 'execute()' function must be defined.");
	}
}

export { IEvent }

