exports.help = {
  name: 'video',
	description: 'Команда позволяет включить видеотрансляцию в определённом голосовом канале.',
	usage: '{необходимо быть в голосовом канале}',
  cooldown: 5,
  flag: 3,
};

exports.run = (client, msg) => {
	if (!msg.member.voiceChannel) {
		msg.author.send('Вы должны находится в голосовом канале!');
		return;
	}

	let embed = new client.userLib.discord.RichEmbed()
		.setAuthor(msg.member.voiceChannel.name, msg.guild.iconURL)
		.setDescription(`[Включить видеотрансляцию](https://discordapp.com/channels/${msg.guild.id}/${msg.member.voiceChannel.id})`)
		.setColor(client.userLib.colors.inf);
	msg.channel.send(embed);
};