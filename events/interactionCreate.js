import { commands } from '../commands';

export default async (client, interaction) => {
	let args, cmd, command;

	switch (interaction.type) {
		case 1:
			console.log('Ping?');
			break;
		case 'APPLICATION_COMMAND':
			cmd = commands[interaction.commandName.toLowerCase()];

			if (!cmd) return console.log(interaction.commandName);

			if (cmd.help.onlyGuild && !interaction.inGuild()) return client.userLib.retError(interaction, 'Команда не доступна для использования в ЛС.');

			if (cmd.help.hasOwnProperty('extraPermissions')) {
				if (!interaction.channel.permissionsFor(interaction.guild.me).has(cmd.help.extraPermissions)){
					return client.userLib.retError(
						interaction,
						'У бота отсутствуют права, необходимые для работы этой команды!\n\n**Требуемые права:** ' + client.userLib.permissionsArrayToString(cmd.help.extraPermissions)
					)
				}
			}
			try {
				client.userLib.sendLog(client.userLib.generateUseLog(interaction.guildId, cmd.command.name, interaction), 'Info');
				await cmd.run(client, interaction);
				client.statistic.executedcmd++;
			// client.localHistory.set(`${interaction.guild_id}_${interaction.user.id}`, interaction);
			} catch (err) {
				client.userLib.sendLog(client.userLib.generateErrLog(interaction.inGuild(), cmd.help.name, interaction, err), 'ERROR!');
				client.userLib.sendWebhookLog(client.userLib.generateErrLog(interaction.inGuild(), cmd.help.name, interaction, err));
				client.userLib.retError(interaction, 'Произошло исключение в работе команды!');
				client.statistic.erroredcmd++;
			}
			break;
		case 'APPLICATION_COMMAND_AUTOCOMPLETE':
			cmd = client.commands.get(interaction.commandName.toLowerCase());

			if (!cmd) return console.log(interaction.commandName);

			await cmd.autocomplete(client, interaction);
			break;
		case 'MESSAGE_COMPONENT':
			args = client.userLib.AESdecrypt(interaction['customId']).split(':');

			if (!interaction.member) {
				interaction.member = {};
				interaction.member.user = interaction.user;
			}

			if (args[1] !== interaction.member.user.id) return;

			command = args[0];
			cmd = client.commands.get(command);
			if (!cmd || !cmd.help.interactions) return;

			cmd.interaction(client, interaction, args);
			client.userLib.sendLog(client.userLib.generateUseLog('interaction', cmd.help.name, interaction), 'Info');
			break;
	}
}
