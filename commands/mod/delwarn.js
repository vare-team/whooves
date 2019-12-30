exports.help = {
  name: "delwarn",
  description: "Снять предупреждение с учасика",
	aliases: ['delw', 'dw'],
  usage: "[@кто] [id]",
	dm: 0,
	args: 1,
	mention: 1,
  tier: -1,
  cooldown: 15
};

exports.run = (client, msg, args) => {

	client.userLib.db.delete('warns', {warnId: args[1], userId: msg.mentions.users.first().id, guildId: msg.guild.id}, (err, affR) => {
		if (!affR) {
			client.userLib.retError(msg.channel, msg.author, 'Тщательно проверив свои записи, я не нашёл предупреждения с такими данными.');
			return;
		}

		if (affR > 1) client.userLib.sendLog('Пизда! Удаление варнов сломалось!');

		let embed = new client.userLib.discord.RichEmbed()
			.setColor(client.userLib.colors.war)
			.setTitle(`Снятие предупреждения.`)
			.setDescription(`Предупреждение *${args[1]}* снято с пользователя ${msg.mentions.users.first()}.`)
			.setTimestamp()
			.setFooter(msg.author.tag, msg.author.avatarURL);

		msg.channel.send(embed);
	});
};