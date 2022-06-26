import { commands } from '../commands/index.js'
import { respondError } from '../utils/modules/respondMessages.js'
import { permissionsArrayToString } from '../utils/functions.js'
import logger, { generateErrLog, generateUseLog } from '../utils/logger.js'

export default async function (interaction) {
	let args, cmd, command

	switch (interaction.type) {
		case 'APPLICATION_COMMAND':
			cmd = commands[interaction.commandName.toLowerCase()]
			if (!cmd) return
			if (cmd.help.onlyGuild && !interaction.inGuild()) return respondError(interaction, 'Команда не доступна для использования в ЛС.')
			if (cmd.help.hasOwnProperty('extraPermissions')) {
				if (!interaction.channel.permissionsFor(interaction.guild.me).has(cmd.help.extraPermissions)) {
					return respondError(
						interaction,
						'У бота отсутствуют права, необходимые для работы этой команды!\n\n**Требуемые права:** ' + permissionsArrayToString(cmd.help.extraPermissions)
					)
				}
			}
			// try {
				logger(generateUseLog(interaction), 'InteractionCreate', 'Log')
				await cmd.run(interaction)
			// } catch (err) {
			// 	logger(generateErrLog(interaction.inGuild(), cmd.help.name, interaction, err), 'InteractionCreate', 'Error')
			// 	// client.userLib.sendWebhookLog(client.userLib.generateErrLog(interaction.inGuild(), cmd.help.name, interaction, err));
			// 	respondError(interaction, 'Произошло исключение в работе команды!')
			// }
			break
		case 'APPLICATION_COMMAND_AUTOCOMPLETE':
			cmd = commands[interaction.commandName.toLowerCase()]

			if (!cmd) return console.log(interaction.commandName)

			await cmd.autocomplete(interaction)
			break
		// case 'MESSAGE_COMPONENT':
		// 	args = client.userLib.AESdecrypt(interaction['customId']).split(':');
		//
		// 	if (!interaction.member) {
		// 		interaction.member = {};
		// 		interaction.member.user = interaction.user;
		// 	}
		//
		// 	if (args[1] !== interaction.member.user.id) return;
		//
		// 	command = args[0];
		// 	cmd = client.commands.get(command);
		// 	if (!cmd || !cmd.help.interactions) return;
		//
		// 	cmd.interaction(client, interaction, args);
		// 	client.userLib.sendLog(client.userLib.generateUseLog('interaction', cmd.help.name, interaction), 'Info');
		// 	break;
	}
}
