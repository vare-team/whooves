let embed;

exports.help = {
    name: "avatar",
    description: "Получить исходный файл аватара",
    usage: "avatar (@кто)",
    flag: 3,
    cooldown: 500
}


exports.run = (client, msg, args, Discord) => {

	if (msg.mentions.users.first()) msg.author = msg.mentions.users.first();

	embed = new Discord.RichEmbed()
		.setTitle("Аватар " + msg.author.username)
		.setColor(client.config.colors.inf)
		.setThumbnail(msg.author.avatarURL)
		.setTimestamp();
	return msg.channel.send({embed});
};