exports.help = {
	name: 'help',
	description: 'Лист команд, позволяет узнать более подробную информацию о каждой команде.',
	usage: [{ type: 'text', opt: 1, name: 'название команды' }],
	dm: 1,
	tier: 0,
	cooldown: 2,
};

exports.command = {
	name: exports.help.name,
	description: exports.help.description,
	options: [
		{
			name: 'команда',
			description: 'название команды',
			type: 3,
		},
	],
};

const { readdirSync, lstatSync } = require('fs'),
	tiers = {
		'-3': 'Владельцу сервера',
		'-2': 'Администраторам сервера',
		'-1': 'Модераторам сервера',
		0: 'Всем пользователям',
		1: 'Не важно',
		2: 'Царям батюшкам',
	},
	modules = {
		dev: 'Команды разработчиков',
		fun: 'Развлечения',
		games: 'Игры',
		pony: 'Пони-команды',
		mod: 'Модерация и конфигурация',
		social: 'Социальные',
		others: 'Остальные',
		images: 'Работа с изображениями',
	};

exports.run = (client, interaction) => {
	if (!interaction.options.getString('команда')) {
		let embed = new client.userLib.discord.MessageEmbed()
			.setColor(client.userLib.colors.inf)
			.setDescription(`Вы можете написать \`/help [название команды]\` чтобы получить подробную информацию!`)
			.setTitle(':paperclip: Список команд:');

		readdirSync('./commands/')
			.filter(dir => lstatSync(`./commands/${dir}`).isDirectory())
			.filter(
				el =>
					el !== 'dev' || (el === 'dev' && client.userLib.admins.hasOwnProperty(client.userLib.getUser(interaction).id))
			)
			.filter(el => client.commands.filter(cmd => cmd.help.module === el).size)
			.forEach((el, index) => {
				embed.addField(
					`${index + 1}. ${modules[el] ? modules[el] : el}`,
					client.commands
						.filter(cmd => cmd.help.module === el)
						.map(cmd => `\`${cmd.help.name}\``)
						.join(', ')
				);
			});

		// client.userLib.replyInteraction(interaction, embed, true);
		interaction.reply({ embeds: [embed], ephemeral: true });
		return;
	}

	const command = client.commands.get(interaction.options.getString('команда'));

	if (!command) {
		client.userLib.retError(
			interaction,
			'Возможно, в другой временной линии эта команда и есть, но тут пока ещё не добавили.'
		);
		return;
	}

	let embed = new client.userLib.discord.MessageEmbed()
		.setColor(client.userLib.colors.inf)
		.setTitle('🔎 Команда: ' + command.help.name);

	if (command.help.description) embed.setDescription(command.help.description);
	embed.addField('Доступно', tiers[command.help.tier]);
	embed.addField('Время между использованиями', `Секунд: \`\`${command.help.cooldown || 3}\`\``);

	interaction.reply({ embeds: [embed], ephemeral: true });
};
