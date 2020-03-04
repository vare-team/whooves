exports.help = {
	name: "settings",
	description: "Настройки бота.\n\`\`prefix [prefix] - префикс бота\nlog [#channel/off] - лог канал\nbadwords [on/off] - фильтр мата\nnormalusername [on/off] - антиюникод в никах\`\`",
	aliases: ['set'],
	usage: [
		{type: 'text', opt: 0, name: 'параметр'},
		{type: 'text', opt: 0, name: 'состояние'}
		],
	dm: 0,
	tier: -2,
	cooldown: 5
};

const parametrs = ['prefix', 'log', 'badwords', 'normalusername'],
			status = ['on', 'off'];

exports.run = async (client, msg, args) => {
	if (parametrs.indexOf(args[0]) == -1) {
		client.userLib.retError(msg, 'Такого параметра не существует.');
		return;
	}

	let embed = new client.userLib.discord.MessageEmbed().setColor(client.userLib.colors.suc).setAuthor(' 🔧 Настройки').setTimestamp().setFooter(msg.author.tag, msg.author.displayAvatarURL());

	switch (args[0]) {
		case 'prefix':
			if (args[1].length > 5) {client.userLib.retError(msg, 'Префикс бота должен быть не более 5 символов!');return;}

			client.userLib.db.update(`guilds`, {guildId: msg.guild.id, prefix: args[1] == 'w.' ? null : args[1]}, () => {
				embed.setDescription(`Теперь префикс для вашего сервера это **${args[1]}**`).setTitle('Префикс бота');
				msg.channel.send(embed);
			});
			break;

		case 'log':
			if (args[1].toLowerCase() !== 'off' && !msg.mentions.channels.first()) {client.userLib.retError(msg, 'Вы должны упомянуть канал или написать \`\`off\`\`!');return;}

			embed.setTitle('Лог канал');

			if (args[1].toLowerCase() === 'off') {
				client.userLib.sendLogChannel("commandUse", msg.guild, {user: {tag: msg.author.tag, id: msg.author.id, avatar: msg.author.displayAvatarURL()}, channel: {id: msg.channel.id}, content: 'отключение лог канала'});
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

			if (!await client.userLib.settingsSet(msg.guild.id, client.userLib.settings.badwords, args[1].toLowerCase() === 'on')) {
				client.userLib.retError(msg, 'Параметр уже находится в текущем значении!');
				return;
			}

			embed.setDescription(`Фильтр плохих слов **${args[1] === 'on' ? 'включен' : 'выключен'}**!`).setTitle('Фильтр плохих слов');
			msg.channel.send(embed);
			break;

		case 'normalusername':
			if (status.indexOf(args[1].toLowerCase()) == -1) {
				client.userLib.retError(msg, 'Статус параметра введён не верно.');
				return;
			}

			if (!await client.userLib.settingsSet(msg.guild.id, client.userLib.settings.usernameChecker, args[1].toLowerCase() === 'on')) {
				client.userLib.retError(msg, 'Параметр уже находится в текущем значении!');
				return;
			}

			embed.setDescription(`Нормализация юзернеймов **${args[1] === 'on' ? 'включена' : 'выключена'}**!`).setTitle('Исправление никнеймов');
			msg.channel.send(embed);
			break;
	}
};