exports.help = {
  name: "info",
  description: "Информация о боте",
	aliases: ['i'],
  usage: [],
	dm: 1,
  tier: 0,
  cooldown: 5
};

const { uptime } = require('os');
const { version } = require("discord.js");

exports.run = async (client, msg) => {

	let logchannel;
		//client.userLib.db.queryValue('SELECT logchannel FROM guilds WHERE guildId = ?', [msg.guild.id], (err, logchannel) =>
	if (msg.channel.type !== 'dm') logchannel = await client.userLib.db.promise().query('SELECT logchannel FROM guilds WHERE guildId = ?', [msg.guild.id]);

			let embed = new client.userLib.discord.RichEmbed()
			.setAuthor(client.user.username + " - информация о боте", client.user.displayAvatarURL, 'https://akin.server-discord.com')
			.setColor(client.userLib.colors.inf)
			.setTimestamp()
			.setFooter(msg.author.tag, msg.author.displayAvatarURL)
			.setTitle('Техническая информация')
			.setDescription(`\`\`\`asciidoc\n
• Пинг          :: ${Math.round(client.ping)} мс
• ОЗУ исп.      :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} МБ
• Бот запустился:: ${client.userLib.moment(client.readyAt, "WWW MMM DD YYYY hh:mm:ss").format('Do MMMM,в HH:mm')}
• Аптайм бота   :: ${Math.round(process.uptime()/3600)} ч.
• Аптайм сервера:: ${Math.round(uptime()/3600)} ч.

• Discord.js    :: v${version}
• Версия Node   :: ${process.version}
• Версия бота   :: v${process.env.version}\`\`\``)
			.addField("Разработчики", `**${client.users.get('166610390581641217').tag}** \n **${client.users.get('321705723216134154').tag}**`, true)
			.addField("Команда помощи", `**w.help**`, true)
			.addField("Префикс", `**w.**`, true)
			.addField("Статистика", `Команд исполнено: **${client.statistic.executedcmd}**\nИз них ошибок: **${client.statistic.erroredcmd}**`, true);
			if (msg.flags.prefix != 'w.') embed.addField("Префикс сервера", `**${msg.flags.prefix}**`, true);
			// if (logchannel[0][0].logchannel) embed.addField("Канал логирования", `**<#${logchannel[0][0].logchannel}>**`, true);
			// embed.addField("Ссылки", `[Сайт](https://akin.server-discord.com)\n[Пригласить бота](https://discordapp.com/api/oauth2/authorize?client_id=531094088695414804&permissions=8&scope=bot)\n[Главный сервер](https://discord.gg/ZF3CKa3)`, true);
			embed.addField("Ссылки", `[Пригласить бота](https://discordapp.com/api/oauth2/authorize?client_id=531094088695414804&permissions=8&scope=bot)\n[Сервер](https://discord.gg/8KKVhTU)`, true);
			if (msg.channel.type !== 'dm') {
				let settings = await client.userLib.settingsGet(msg.guild.id);
				embed.addField("Настройки", `Канал логирования: ${logchannel[0][0].logchannel ? `<#${logchannel[0][0].logchannel}>` : '**OFF**'}\nФильтр плохих слов: **${settings & client.userLib.settings.badwords ? 'ON' : 'OFF'}**\nИсправитель никнеймов: **${settings & client.userLib.settings.usernameChecker ? 'ON' : 'OFF'}**`, true);
			}

			msg.channel.send(embed);

};