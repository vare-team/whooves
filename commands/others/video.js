exports.help = {
  name: 'video',
	description: 'Команда позволяет включить видеотрансляцию в определённом голосовом канале.',
	aliases: ['vid'],
	usage: [{type: 'voice'}],
	dm: 0,
	tier: 0,
  cooldown: 5
};

exports.run = (client, msg) => {
	let embed = new client.userLib.discord.MessageEmbed()
		.setAuthor(msg.member.voiceChannel.name, msg.guild.iconURL)
		.setDescription(`[Включить видеотрансляцию](https://discordapp.com/channels/${msg.guild.id}/${msg.member.voiceChannel.id})`)
		.setColor(client.userLib.colors.inf);
	msg.channel.send(embed);
};