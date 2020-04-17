exports.help = {
	name: 'settings',
	description: 'Настройки бота.\n\`\`prefix [prefix] - префикс бота\nlog [#channel/off] - лог канал\nbadwords [on/off] - фильтр мата\nusernamechecker [on/off] - антиюникод в никах\`\`',
	aliases: ['set'],
	usage: [
		{type: 'text', opt: 0, name: 'параметр'},
		{type: 'text', opt: 0, name: 'состояние'}
	],
	dm: 0,
	tier: -2,
	cooldown: 5
};

const parametrs = ['prefix', 'log', 'badwords', 'usernamechecker'],
	status = ['on', 'off'],
	normalizeParametrs = {
		'badwords': 'Фильтр плохих слов',
		'usernamechecker': 'Исправление никнеймов'
	};

exports.run = async (client, msg, args) => {
	if (parametrs.indexOf(args[0]) == -1) {
		client.userLib.retError(msg, 'Такого параметра не существует. Доступные параметры: ' + parametrs.join(', '));
		return;
	}

	if (args[0] === 'prefix' && args[1].length > 5) {
		client.userLib.retError(msg, 'Префикс бота должен быть не более 5 символов!');
		return;
	}

	if (args[0] === 'log' && args[1] !== 'off' && !msg.mentions.channels.first()) {
		client.userLib.retError(msg, 'Вы должны упомянуть канал или написать \`\`off\`\`!');
		return;
	}

	if (parametrs.slice(2).indexOf(args[0]) != -1 && status.indexOf(args[1]) == -1) {
		client.userLib.retError(msg, 'Статус параметра введён не верно. Доступные статусы: ' + status.join(', '));
		return;
	}

	let embed = new client.userLib.discord.MessageEmbed().setColor(client.userLib.colors.suc).setAuthor('🔧 Настройки').setTimestamp().setFooter(msg.author.tag, msg.author.displayAvatarURL());

	switch (args[0]) {
		case 'prefix':
			client.userLib.db.update(`guilds`, {guildId: msg.guild.id, prefix: args[1] == 'w.' ? null : args[1]}, () => {});
			embed.setDescription(`Теперь префикс для вашего сервера это **${args[1]}**`).setTitle('Префикс бота');
			break;
		case 'log':
			if (args[1] === 'off')
				client.userLib.sendLogChannel('commandUse', msg.guild, {user: {tag: msg.author.tag, id: msg.author.id, avatar: msg.author.displayAvatarURL()}, channel: {id: msg.channel.id}, content: 'отключение лог канала'});

			client.userLib.db.update(`guilds`, {guildId: msg.guild.id, logchannel: args[1] === 'off' ? null : msg.mentions.channels.first().id}, () => {});
			embed.setTitle('Лог канал').setDescription(args[1] === 'off' ? `Лог канал отключён.` : `Лог канал теперь ${msg.mentions.channels.first()}`);
			break;
		default:
			if (!await client.userLib.setSettings(msg.guild.id, args[0], args[1] === 'on')) {
				client.userLib.retError(msg, 'Параметр уже находится в текущем значении!');
				return;
			}

			embed.setDescription(`${normalizeParametrs[args[0]]} **${args[1] === 'on' ? 'включен' : 'выключен'}**!`).setTitle(normalizeParametrs[args[0]]);
			break;
	}

	msg.channel.send(embed);
};