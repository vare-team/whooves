exports.help = {
  name: "warn",
  description: "Выдать предупреждение участнику",
	aliases: ['w'],
  usage: "[@кто]/[причина]",
	dm: 1,
	tier: -1,
  cooldown: 5
};

exports.run = (client, msg, args) => {

	client.userLib.db.insert('warns', {
		userId: msg.mentions.users.first().id,
		guildId: msg.guild.id,
		who: msg.author.id,
		reason: args.slice(1).join(' ')
	}, () => {});

	let embed = new client.userLib.discord.RichEmbed()
		.setColor(client.userLib.colors.war)
		.setTitle(`${msg.mentions.users.first().tag} выдано предупреждение!`)
		.setDescription('Причина:' + args.slice(1).join(' '))
		.setTimestamp()
		.setFooter(msg.author.tag, msg.author.avatarURL);

	msg.channel.send(embed);
};