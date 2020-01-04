exports.help = {
	name: 'help',
	description: 'Лист команд, позволяет узнать более подробную информацию о каждой команде.',
	aliases: ['commands', 'h'],
	usage: '[command name]',
	dm: 1,
	args: 0,
	tier: 0,
	cooldown: 2
};

const { readdirSync, lstatSync } = require("fs"),
tiers = {
	'-3': 'Владельцу сервера',
	'-2': 'Администраторам сервера',
	'-1': 'Модераторам сервера',
	'0': 'Всем пользователям',
	'1': 'Не важно',
	'2': 'Царям батюшкам'
},
modules = {
	dev: 'Команды разработчиков',
	fun: 'Развлечения',
	games: 'Игры',
	mod: 'Модерация и конфигурация',
	social: 'Социальные',
	others: 'Остальные'
};

exports.run = (client, msg, args) => {
	let kostyl = 0; // Если бы не костыль, то при скрытии категории index бы дальше продолжил бы рости.

	function list(cat) {
		return client.commands
			.filter(cmd => cmd.help.module == cat)
			.map(cmd => `\`${cmd.help.name}\``)
			.join(", ");
	}

	if (!args.length) {
		let embed = new client.userLib.discord.RichEmbed()
			.setColor(client.userLib.colors.inf)
			.setDescription(`Вы можете написать \`${msg.flags.prefix}help [command name]\` чтобы получить подробную информацию!`)
			.setTitle(':paperclip: Список команд:')
			.setFooter(msg.author.tag, msg.author.displayAvatarURL);

		readdirSync('./commands/').filter(dir => lstatSync(`./commands/${dir}`).isDirectory())
			.forEach((el) => {
			if (!list(el).length) return;
			if (el == 'dev' && !client.userLib.admins.hasOwnProperty(msg.author.id)) return;
			embed.addField( `${kostyl++ + (client.userLib.admins.hasOwnProperty(msg.author.id) ? 1 : 0)}. ${modules[el] ? modules[el] : el}`, list(el));
		});

		msg.channel.send({embed, split: true });
		return;
	}


	const name = args[0].toLowerCase();
	const command = client.commands.get(name) || client.commands.find(c => c.help.aliases && c.help.aliases.includes(name));

	if (!command) {
		client.userLib.retError(msg.channel, msg.author, 'Возможно, в другой временной линии эта команда и есть, но тут пока ещё не добавили.');
		return;
	}

	let embed = new client.userLib.discord.RichEmbed()
		.setAuthor(client.user.username, client.user.avatarURL)
		.setColor(client.userLib.colors.inf)
		.setTitle("Команда: " + command.help.name);

	if (command.help.description) embed.addField("Описание", command.help.description);
	if (command.help.aliases.length) embed.addField("Псевдонимы", command.help.aliases.join(', '));
	if (command.help.usage) embed.addField("Использование", `${msg.flags.prefix}${command.help.name} *${command.help.usage}*`);
	embed.addField("Доступно", tiers[command.help.tier]);
	embed.addField("Время между использованиями", `Секунд: \`\`${command.cooldown || 3}\`\``);

	msg.channel.send(embed);
};