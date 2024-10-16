class ICommand {
	constructor() {
		if(this.constructor.name === 'ICommand') {
			throw new Error("'ICommand' is an abstract class and cannot be instantiated.");
		}
	}

	get version() {
		throw new Error("Property 'version' must be implemented.");
	}

	get data() {
		throw new Error("Property 'data' must be implemented.");
	}
}

export { ICommand }

