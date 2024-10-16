class IEvent {

	constructor() {
		if(this.constructor.name === 'IEvent') {
			throw new Error("IEvent is an abstract class and cannot be instantiated.");
		}
	}

	async execute() {
		throw new Error("The 'execute()' function must be defined.");
	}
}

