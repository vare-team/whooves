exports.help = {
	name: 'help',
	description: 'Лист команд, позволяет узнать более подробную информацию о каждой команде.',
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
		context: 'Контекстные команды',
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
					el !== 'dev' || (el === 'dev' && client.userLib.admins.hasOwnProperty(interaction.user.id))
			)
			.filter(el => client.commands.filter(cmd => cmd.help.module === el).size)
			.forEach((el) => {
				embed.addField(
					`${modules[el] ? modules[el] : el}`,
					client.commands
						.filter(cmd => cmd.help.module === el)
						.map(
							cmd =>
								`\`${cmd.help.module !== 'context' ? '/' : ''}${cmd.help.name}\` — ${
									cmd.help.description.split('\n')[0]
								}`
						)
						.join('\n')
				);
			});
		return interaction.reply({ embeds: [embed], ephemeral: true });
	}

	const command = client.commands.get(interaction.options.getString('команда').toLowerCase());

	if (!command) {
		client.userLib.retError(
			interaction,
			'Возможно, в другой временной линии эта команда и есть, но тут пока ещё не добавили.'
		);
		return;
	}

	let embed = new client.userLib.discord.MessageEmbed()
		.setColor(client.userLib.colors.inf)
		.setTitle(
			command.help.module === 'context' ? '🖱️ Опция: ' + command.help.name : '🔎 Команда: ' + command.help.name
		);

	if (command.help.description) embed.setDescription(command.help.description);
	embed.addField('Использование', command.help.onlyGuild ? 'Только для гильдий' : 'ЛС И Гильдия')

	interaction.reply({ embeds: [embed], ephemeral: true });
};
