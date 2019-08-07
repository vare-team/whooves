exports.help = {
    name: "setprefix",
    description: "Задать префикс для бота на сервере",
    usage: "setprefix [символ]",
    flag: 1,
    cooldown: 500
};

exports.run = (client, msg, args, Discord) => {
	var embed = new Discord.RichEmbed();

	let prfx = args[0];
	if(!prfx) {embed.setColor(client.userLib.config.colors.err).setTitle('Ошибка!').setDescription(`Вы не указали префикс бота!`);return msg.channel.send(embed);}
	if (prfx > 3) {embed.setColor(client.userLib.config.colors.err).setTitle('Ошибка!').setDescription(`Префикс должен быть не более 3 символов!`);return msg.channel.send(embed);}

	client.userLib.db.upsert(`guilds`, {id: msg.guild.id, prefix: prfx}, (err) => {
		embed.setColor(client.userLib.config.colors.suc).setTitle('Префикс изменён!').setDescription(`Теперь префикс для вашего сервера это **${prfx}**`).setTimestamp();
		return msg.channel.send(embed);
	});
};