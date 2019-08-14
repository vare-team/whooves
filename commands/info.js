exports.help = {
    name: "info",
    description: "Информация о боте",
    usage: "info",
    flag: 3,
    cooldown: 500
}

const os = require('os');
const { version } = require("discord.js");

exports.run = (client, msg, args, Discord) => {

	client.db.queryValue('SELECT prefix FROM servers WHERE id = ?', [msg.guild.id], (err, prefix) => {
		client.db.queryValue('SELECT logchannel FROM servers WHERE id = ?', [msg.guild.id], (err, logchannel) => {
			embed = new Discord.RichEmbed()
			.setAuthor(client.user.username + " - информация о боте", client.user.avatarURL, 'https://akin.server-discord.com')
			.setColor(client.config.colors.inf)
			.setTimestamp()
			.setTitle('Техническая информация')
			.setDescription(`\`\`\`asciidoc\n
• Пинг          :: ${Math.round(client.ping)} мс
• ОЗУ исп.      :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} МБ
• Бот запустился:: ${moment(client.readyAt, "WWW MMM DD YYYY hh:mm:ss").format('Do MMMM,в HH:mm')}
• Аптайм бота   :: ${Math.round(process.uptime()/3600)} ч.
• Аптайм сервера:: ${Math.round(os.uptime()/3600)} ч.
• Discord.js    :: v${version}
• Версия Node   :: ${process.version}\`\`\``)
			.addField("Разработчики", `**${client.users.get('166610390581641217').tag}** \n **${client.users.get('194384673672003584').tag}**`, true)
			.addField("Команда помощи", `**;help**`, true)
			.addField("Префикс", `**;**`, true);
			if (prefix != client.config.prefix) embed.addField("Префикс сервера", `**${prefix}**`, true);
			if (logchannel != 0) embed.addField("Канал логирования", `**<#${logchannel}>**`, true);
			embed.addField("Ссылки", `[Сайт](https://akin.server-discord.com)\n[Пригласить бота](https://discordapp.com/api/oauth2/authorize?client_id=531094088695414804&permissions=8&scope=bot)\n[Главный сервер](https://discord.gg/ZF3CKa3)`, true)
			
			msg.channel.send({embed});
		});
	});

}