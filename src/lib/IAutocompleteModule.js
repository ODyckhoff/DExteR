class IAutocompleteModule {

	constructor() {
		if(this.constructor.name === 'IAutocompleteModule') {
			throw new Error("IAutocompleteModule is an abstract class and cannot be instantiated.");
		}
	}

	handleAutocomplete(interaction) {
		throw new Error("Method 'handleAutocomplete()' must be implemented.");
	}
}

