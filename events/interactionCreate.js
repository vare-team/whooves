import commands from '../commands/index.js';
import logger, { generateErrLog, generateUseLog } from '../utils/logger.js';
import onAutocomplete from './onAutocomplete.js';

const runners = commands.runners;

/**
 *
 * @param interaction {BaseInteraction}
 * @return {Promise<void>}
 */
export default async function (interaction) {
	logger(generateUseLog(interaction), 'core');

	if (interaction.isAutocomplete()) return onAutocomplete(interaction);
	if (!(interaction.isCommand() || interaction.isContextMenuCommand())) return;

	const command =
		runners[interaction.commandName] ??
		runners[interaction.options.getSubcommandGroup()] ??
		runners[interaction.options.getSubcommand()];
	if (!command) return;
	await command(interaction);
	// .catch(e => logger(generateErrLog(interaction.commandName, interaction, e)));
}
