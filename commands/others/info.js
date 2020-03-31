exports.help = {
  name: "info",
  description: "Информация о боте",
	aliases: ['i'],
  usage: [],
	dm: 1,
  tier: 0,
  cooldown: 5
};

const { uptime } = require('os'),
	{ version } = require('../../package');

exports.run = async (client, msg) => {

			let embed = new client.userLib.discord.MessageEmbed()
				.setAuthor(client.user.username + " - информация о боте", client.user.displayAvatarURL())
				.setColor(client.userLib.colors.inf)
				.setTimestamp()
				.setFooter(msg.author.tag, msg.author.displayAvatarURL())
				.setTitle('Техническая информация')
				.setDescription(`\`\`\`asciidoc\n
• Пинг          :: ${Math.round(client.ws.ping)} мс
• ОЗУ исп.      :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} МБ
• Бот запустился:: ${client.userLib.moment(client.readyAt, "WWW MMM DD YYYY hh:mm:ss").format('Do MMMM,в HH:mm')}
• Аптайм бота   :: ${Math.round(process.uptime()/3600)} ч.
• Аптайм сервера:: ${Math.round(uptime()/3600)} ч.

• Discord.js    :: v${client.userLib.discord.version}
• Версия Node   :: ${process.version}
• Версия бота   :: v${version}\`\`\``)
				.addField("Разработчики", `**${client.users.cache.get('166610390581641217').tag}** \n **${client.users.cache.get('321705723216134154').tag}**`, true)
				.addField("Команда помощи", `**w.help**`, true)
				.addField("Префикс", `**w.**`, true)
				.addField("Статистика", `Команд исполнено: **${client.statistic.executedcmd}**\nИз них ошибок: **${client.statistic.erroredcmd}**`, true);

			if (msg.flags.prefix != 'w.') embed.addField("Префикс сервера", `**${msg.flags.prefix}**`, true);

			embed.addField("Ссылки", `[Пригласить бота](https://discordapp.com/api/oauth2/authorize?client_id=531094088695414804&permissions=8&scope=bot)\n[Сервер](https://discord.gg/8KKVhTU)`, true);

			if (msg.channel.type !== 'dm') {
				let data = await client.userLib.db.promise().query('SELECT logchannel, settings FROM guilds WHERE guildId = ?', [msg.guild.id]);
				data = data[0][0];
				embed.addField("Настройки", `Канал логирования: ${data.logchannel ? `<#${data.logchannel}>` : client.userLib.emoji.err}
Фильтр плохих слов: **${data.settings & client.userLib.settings.badwords ? client.userLib.emoji.ready : client.userLib.emoji.err}**
Исправитель никнеймов: **${data.settings & client.userLib.settings.usernamechecker ? client.userLib.emoji.ready : client.userLib.emoji.err}**`, true);
			}

			msg.channel.send(embed);
};