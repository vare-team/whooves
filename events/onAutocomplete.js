import commands from '../commands/index.js';

const autocompletes = commands.autocompletes;

/**
 *
 * @param interaction {AutocompleteInteraction}
 * @return {Promise<void>}
 */
export default async function (interaction) {
	const autocomplete = autocompletes[interaction.commandName];

	if (!autocomplete) return console.log(interaction.commandName);

	await autocomplete(interaction);
}
