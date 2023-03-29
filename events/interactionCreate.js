import commands from '../commands/index.js';
import logger, { generateErrLog, generateUseLog } from '../utils/logger.js';

const runners = commands.runners;
const autocompletes = commands.autocompletes;
const components = commands.components;

/**
 *
 * @param interaction {BaseInteraction}
 * @return {Promise<void>}
 */
export default async function (interaction) {
	if (interaction.isAutocomplete()) return commands.execute(interaction, autocompletes);

	logger(generateUseLog(interaction), 'core');
	if (interaction.isMessageComponent()) return commands.execute(interaction, components);
	if (!(interaction.isCommand() || interaction.isContextMenuCommand())) return;

	if (process.env.NODE_ENV === 'production')
		commands.execute(interaction, runners)?.catch(e => logger(generateErrLog(interaction.commandName, interaction, e)));
	else commands.execute(interaction, runners);
}
