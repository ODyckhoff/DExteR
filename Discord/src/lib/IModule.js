class IModule {
	constructor() {
		if(this.constructor === IModule) {
			throw new Error("Abstract classes can't be instantiated.");
		}
	}

	get version() {
		throw new Error("Property 'version' must be implemented.");
	}

	start(client) {
		throw new Error("Method 'start()' must be implemented");
	}

	stop() {
		throw new Error("Method 'stop()' must be implemented");
	}
}

