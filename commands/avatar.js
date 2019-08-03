exports.help = {
    name: "avatar",
    description: "Получить аватарку пользователя",
    usage: "avatar (@кто)",
    flag: 3,
    cooldown: 500
};

exports.run = (client, msg, args, Discord) => {
	var user = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[0]));
	var embed = new Discord.RichEmbed();
	(user) ? embed.setTitle("Аватар " + user.user.username) : embed.setTitle("Аватар " + msg.author.username);
	embed.setColor(client.userLib.config.colors.inf);
	(user) ? embed.setImage(user.user.displayAvatarURL) : embed.setImage(msg.author.displayAvatarURL);
	embed.setTimestamp();

	return msg.channel.send(embed);
};