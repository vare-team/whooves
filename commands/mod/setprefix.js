exports.help = {
  name: "setprefix",
  description: "Задать префикс для бота на сервере",
	aliases: ['setp'],
  usage: "[символ]",
	dm: 0,
  tier: -3,
  cooldown: 15
};

exports.run = (client, msg, args) => {
	if (args[0].length > 5) {
		client.userLib.retError(msg.channel, msg.author, 'Префикс бота должен быть не более 1 символа!');
		return;
	}

	client.userLib.db.update(`guilds`, {guildId: msg.guild.id, prefix: args[0] == 'w.' ? null : args[0]}, () => {
		let embed = new client.userLib.discord.RichEmbed()
			.setColor(client.userLib.colors.suc)
			.setTitle('Префикс изменён!')
			.setDescription(`Теперь префикс для вашего сервера это **${args[0]}**`)
			.setFooter(msg.author.tag, msg.author.displayAvatarURL)
			.setTimestamp();
		msg.channel.send(embed);
	});
};