module.exports = async (client, interaction) => {
	let args, cmd, command;

	switch (interaction.type) {
		case 1:
			console.log('Ping?');
			break;
		case 'APPLICATION_COMMAND':
			if (!interaction.isCommand()) return;
			cmd = client.commands.get(interaction.commandName);

			// if (cmd.help.hide) return client.userLib.retError(interaction, 'Команда в данный момент отключена!');

			if (!interaction.guildId && !cmd.help.dm) {
				client.userLib.retError(interaction, 'Команда не доступна для использования в ЛС.');
				return;
			}

			// try {
			client.userLib.sendLog(client.userLib.generateUseLog(interaction.guildId, cmd.help.name, interaction), 'Info');
			await cmd.run(client, interaction);
			client.statistic.executedcmd++;
			// } catch (err) {
			// 	client.userLib.sendLog(client.userLib.generateErrLog(msg.channel.type, cmd.help.name, msg, err), 'ERROR!');
			// 	client.userLib.sendWebhookLog(client.userLib.generateErrLog(msg.channel.type, cmd.help.name, msg, err));
			// 	client.userLib.retError(msg, 'Произошло исключение в работе команды!');
			// 	client.statistic.erroredcmd++;
			// }
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
};