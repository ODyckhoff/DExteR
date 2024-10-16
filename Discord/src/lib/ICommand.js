class ICommand {
	constructor() {
		if(this.constructor.name === 'ICommand') {
			throw new Error("'ICommand' is an abstract class and cannot be instantiated.");
		}
	}

	execute() {
		throw new Error("The 'execute()' method must be defined.");
	}
}

