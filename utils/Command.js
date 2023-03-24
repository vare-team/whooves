export default class Command {
	/**
	 *
	 * @param builder {SlashCommandBuilder | ContextMenuCommandBuilder | SlashCommandSubcommandBuilder | Omit<SlashCommandBuilder | ContextMenuCommandBuilder | SlashCommandSubcommandBuilder>}
	 * @param run {(function(interaction: (CommandInteraction | ContextMenuCommandInteraction)): Promise<*>)}
	 * @param autocomplete {(function(interaction: AutocompleteInteraction): Promise<*>) | null}
	 */
	constructor(builder, run, autocomplete = null) {
		this.builder = builder;
		this.run = run;
		this.autocomplete = autocomplete;
	}
}
