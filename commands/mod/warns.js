exports.help = {
  name: "warns",
  description: "Количество ваших предупреждений",
	aliases: [],
  usage: "warns",
	dm: 0,
  args: 0,
	tier: 0,
  cooldown: 15
};

let embed, user;

exports.run = (client, msg, args, Discord) => {

	client.db.queryValue('SELECT warns FROM users WHERE id = ? AND serid = ?', [msg.author.id, msg.guild.id], (err, warns) => {
		if (!warns) {embed = new client.discord.RichEmbed().setColor(client.config.colors.inf).setTitle('Предупреждения').setDescription(`У тебя ещё не было предупреждений`).setTimestamp();return msg .channel.send({embed});}
		embed = new Discord.RichEmbed()
		.setColor(client.config.colors.inf)
		.setTitle('Предупреждения')
		.setDescription(`У тебя **${warns}** предупреждений.`).setTimestamp().setFooter(msg.author.tag, msg.author.avatarURL);
		return msg.channel.send({embed});
	});

};