export default class Commands {
	/**
	 *
	 * @param builders {[SlashCommandBuilder | ContextMenuCommandBuilder | SlashCommandSubcommandBuilder]}
	 * @param runners {Object<string, (function(interaction): Promise<*>)>}
	 * @param autocompletes {Object<string, (function(interaction: AutocompleteInteraction): Promise<*>)>}
	 * @param components {Object<string, (function(interaction: MessageComponentInteraction): Promise<*>)>}
	 */
	constructor(builders, runners, autocompletes, components) {
		this.builders = builders;
		this.runners = runners;
		this.autocompletes = autocompletes;
		this.components = components;
	}

	execute(interaction, executors) {
		const local = interaction.options ? interaction : interaction.message.interaction;

		const command =
			executors[local.commandName] ??
			executors[local.options?.getSubcommandGroup()] ??
			executors[local.options?.getSubcommand()] ??
			executors[local.commandName.split(' ').at(-1)];

		if (!command) return;
		return command(interaction);
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
		const components = mapComponents(commands);

		return new Commands(builders, runners, autocompletes, components);
	}

	/**
	 *
	 * @param commands {[Command]}
	 * @return {Object<string, (function(): Promise<*>)>}
	 */
	static mapRunners(commands) {
		return commands.reduce((data, command) => ({ ...data, [command.builder.name]: command.run }), {});
	}

	/**
	 *
	 * @param commands {[Command]}
	 * @return {Object<string, (function(): Promise<*>)>}
	 */
	static mapAutocomplete(commands) {
		return commands
			.filter(c => c.autocomplete)
			.reduce((data, command) => ({ ...data, [command.builder.name]: command.autocomplete }), {});
	}

	/**
	 *
	 * @param baseBuilder {SlashCommandBuilder}
	 * @param commands {[SlashCommandSubcommandBuilder]}
	 * @returns {SlashCommandBuilder}
	 */
	static mapSubcommands(baseBuilder, commands) {
		for (const command of commands) baseBuilder.addSubcommand(command);
		return baseBuilder;
	}

	static mapComponents(commands) {
		return commands
			.filter(c => c.components)
			.reduce((data, command) => ({ ...data, [command.builder.name]: command.components }), {});
	}
}

/**
 *
 * @param commands {Commands[]}
 * @return {[SlashCommandBuilder | ContextMenuCommandBuilder | SlashCommandSubcommandBuilder]}
 */
function mapBuilders(commands) {
	return commands.map(c => c.builders).flat(2);
}

/**
 *
 * @param commands {[Commands]}
 * @return {Object<string, (function(*): Promise<*>)>}
 */
function mapRunners(commands) {
	return commands.reduce((a, c) => ({ ...a, ...c.runners }), {});
}

/**
 *
 * @param commands {[Commands]}
 * @return {Object<string, (function(*): Promise<*>)>}
 */
function mapAutocompletes(commands) {
	return commands.reduce((a, c) => ({ ...a, ...c.autocompletes }), {});
}

function mapComponents(commands) {
	return commands.reduce((a, c) => ({ ...a, ...c.components }), {});
}
