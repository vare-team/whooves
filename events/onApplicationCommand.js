import { commands } from '../commands/index.js';
import { respondError } from '../utils/modules/respondMessages.js';
import { permissionsArrayToString } from '../utils/functions.js';
import logger, { generateUseLog } from '../utils/logger.js';

export default async function (interaction) {
	const cmd = commands[interaction.commandName.toLowerCase()];
	if (!cmd) return;
	//if (cmd.help.onlyGuild && !interaction.inGuild()) return respondError(interaction, 'Команда не доступна для использования в ЛС.')
	if (cmd.help.hasOwnProperty('extraPermissions')) {
		if (!interaction.channel.permissionsFor(interaction.guild.me).has(cmd.help.extraPermissions)) {
			return respondError(
				interaction,
				`У бота отсутствуют права, необходимые для работы этой команды!\n\n**Требуемые права:** ${permissionsArrayToString(
					cmd.help.extraPermissions
				)}`
			);
		}
	}

	//logger(generateUseLog(interaction), 'InteractionCreate', 'Log')
	await cmd.run(interaction);
}
