exports.help = {
  name: 'video',
	description: 'Команда позволяет включить видеотрансляцию в определённом голосовом канале.',
	aliases: ['vid'],
	usage: '[>подключение]',
	dm: 0,
	tier: 0,
  cooldown: 30
};

exports.run = (client, msg) => {
	let embed = new client.userLib.discord.RichEmbed()
		.setAuthor(msg.member.voiceChannel.name, msg.guild.iconURL)
		.setDescription(`[Включить видеотрансляцию](https://discordapp.com/channels/${msg.guild.id}/${msg.member.voiceChannel.id})`)
		.setColor(client.userLib.colors.inf);
	msg.channel.send(embed);
};