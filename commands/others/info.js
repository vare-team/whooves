exports.help = {
	name: 'info',
	description: 'Информация о боте',
};

exports.command = {
	name: exports.help.name,
	description: exports.help.description,
};

const { version } = require('../../package');

exports.run = async (client, interaction) => {
	const row = new client.userLib.discord.MessageActionRow().addComponents(
		new client.userLib.discord.MessageButton()
			.setLabel('Github')
			.setStyle('LINK')
			.setURL('https://github.com/vare-team/whooves')
			.setEmoji('🌀'),
		new client.userLib.discord.MessageButton()
			.setLabel('Сервер поддержки')
			.setStyle('LINK')
			.setURL('https://discordapp.com/invite/8KKVhTU')
			.setEmoji('💬')
	);

	const embed = new client.userLib.discord.MessageEmbed()
		.setAuthor(`${client.user.username} - информация о боте`, client.user.displayAvatarURL())
		.setColor(client.userLib.colors.inf)
		.addField(
			'Статистика:',
			`\`\`\`c\n
Пинг:             ${Math.round(client.ws.ping)} ms
Команд исполнено: ${client.statistic.executedcmd}
Из них ошибок:    ${client.statistic.erroredcmd}
\`\`\``,
			true
		)
		.addField(
			'Зависимости:',
			`\`\`\`c\nВерсия бота:    ${version}\nDiscord.js:     ${
				client.userLib.discord.version
			}\nВерсия Node:    ${process.version.replace('v', '')}\`\`\``,
			true
		)
		.addField(
			'Разработчики:',
			`**${
				client.users.cache.get('166610390581641217')
					? client.users.cache.get('166610390581641217').tag
					: 'Dellyare#0720'
			}** \n **${
				client.users.cache.get('321705723216134154')
					? client.users.cache.get('321705723216134154').tag
					: 'MegaVasiliy007#3301'
			}**`,
			false
		);

	if (interaction.inGuild()) {
		let data = await client.userLib.db
			.promise()
			.query('SELECT logchannel, settings FROM guilds WHERE guildId = ?', [interaction.guildId]);
		data = data[0][0];
		embed.addField(
			'Настройки:',
			`Канал логирования: ${data.logchannel ? `<#${data.logchannel}>` : client.userLib.emoji.err}
Фильтр плохих слов: **${
				data.settings & client.userLib.settings.badwords ? client.userLib.emoji.ready : client.userLib.emoji.err
			}**
Исправитель никнеймов: **${
				data.settings & client.userLib.settings.usernamechecker ? client.userLib.emoji.ready : client.userLib.emoji.err
			}**`,
			true
		);
	}

	interaction.reply({ embeds: [embed], components: [row] });
};
