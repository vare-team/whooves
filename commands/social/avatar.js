exports.help = {
  name: "avatar",
  description: "Ссылка на аватара пользователя",
	aliases: ['a'],
  usage: "(@кто)",
	dm: 0,
  tier: 0,
  cooldown: 1
};

exports.run = (client, msg, args) => {

	let user = msg.magicMention ? msg.magicMention : msg.guild.members.get(args[0]) ? msg.guild.members.get(args[0]).user : msg.author;

	let embed = new client.userLib.discord.RichEmbed()
		.setDescription("Аватар " + user)
		.setColor(client.userLib.colors.inf)
		.setImage(user.avatarURL + '?size=512')
		.setTimestamp();
	if (user.avatar.startsWith('a_')) embed.setFooter('GIF');
	msg.channel.send(embed);
};