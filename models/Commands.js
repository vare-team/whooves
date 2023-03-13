export default class Commands {
	/**
	 *
	 * @param builders {[SlashCommandBuilder | ContextMenuCommandBuilder | SlashCommandSubcommandBuilder]}
	 * @param runners {Object<string, (function(interaction): Promise<*>)>}
	 * @param autocompletes {Object<string, (function(interaction: AutocompleteInteraction): Promise<*>)>}
	 */
	constructor(builders, runners, autocompletes) {
		this.builders = builders;
		this.runners = runners;
		this.autocompletes = autocompletes;
	}

	/**
	 *
	 * @param commands {[Commands]}
	 * @return {Commands}
	 */
	static fromCommands(commands) {
		const builders = mapBuilders(commands);
		const runners = mapRunners(commands);
		const autocompletes = mapAutocompletes(commands);

		return new Commands(builders, runners, autocompletes);
	}
}

/**
 *
 * @param commands {Commands[]}
 * @return {[SlashCommandBuilder | ContextMenuCommandBuilder | SlashCommandSubcommandBuilder]}
 */
function mapBuilders(commands) {
	const builders = [];
	builders.push(...commands.map(c => c.builders));

	return builders;
}

/**
 *
 * @param commands {[Commands]}
 * @return {Object<string, (function(*): Promise<*>)>}
 */
function mapRunners(commands) {
	const runnersArray = [];
	runnersArray.push(commands.map(c => c.runners));

	return Object.assign({}, ...runnersArray);
}

/**
 *
 * @param commands {[Commands]}
 * @return {Object<string, (function(*): Promise<*>)>}
 */
function mapAutocompletes(commands) {
	const autocompletesArray = [];
	autocompletesArray.push(commands.map(c => c.autocompletes));

	return Object.assign({}, ...autocompletesArray);
}
