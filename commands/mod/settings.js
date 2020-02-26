exports.help = {
	name: "settings",
	description: "Настройки бота.\n\`\`prefix [prefix]\nlog [#channel/off]\nbadwords [on/off]\`\`",
	aliases: ['set'],
	usage: [
		{type: 'text', opt: 0, name: 'параметр'},
		{type: 'text', opt: 0, name: 'состояние'}
		],
	dm: 0,
	tier: -2,
	cooldown: 5
};

const parametrs = ['prefix', 'log', 'badwords'],
			status = ['on', 'off'];

exports.run = (client, msg, args) => {
	if (parametrs.indexOf(args[0]) == -1) {
		client.userLib.retError(msg, 'Такого параметра не существует.');
		return;
	}

	switch (args[0]) {
		case 'prefix':
			if (args[1].length > 5) {client.userLib.retError(msg, 'Префикс бота должен быть не более 5 символов!');return;}

			client.userLib.db.update(`guilds`, {guildId: msg.guild.id, prefix: args[1] == 'w.' ? null : args[1]}, () => {
				let embed = new client.userLib.discord.RichEmbed().setColor(client.userLib.colors.suc).setTitle('Префикс изменён!').setDescription(`Теперь префикс для вашего сервера это **${args[1]}**`).setFooter(msg.author.tag, msg.author.displayAvatarURL).setTimestamp();
				msg.channel.send(embed);
			});
			break;

		case 'log':
			if (args[1].toLowerCase() !== 'off' && !msg.mentions.channels.first()) {client.userLib.retError(msg, 'Вы должны упомянуть канал или написать \`\`off\`\`!');return;}

			let embed = new client.userLib.discord.RichEmbed().setColor(client.userLib.colors.suc).setTitle('Лог канал').setTimestamp();

			if (args[1].toLowerCase() === 'off') {
				client.userLib.sendLogChannel("commandUse", msg.guild, {user: {tag: msg.author.tag, id: msg.author.id, avatar: msg.author.displayAvatarURL}, channel: {id: msg.channel.id}, content: 'отключение лог канала'});
				client.userLib.db.upsert(`guilds`, {guildId: msg.guild.id, logchannel: null}, () => {embed.setDescription(`Лог канал отключён.`);msg.channel.send(embed);});
			} else {
				client.userLib.db.update(`guilds`, {guildId: msg.guild.id, logchannel: msg.mentions.channels.first().id}, () => {embed.setDescription(`Лог канал теперь ${msg.mentions.channels.first()}`);msg.channel.send(embed);})
			}
			break;

		case 'badwords':
			if (status.indexOf(args[1].toLowerCase()) == -1) {
				client.userLib.retError(msg, 'Статус параметра введён не верно.');
				return;
			}
			break;
	}
};