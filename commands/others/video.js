exports.help = {
  name: 'video',
	description: 'Команда позволяет включить видеотрансляцию в определённом голосовом канале.',
	aliases: ['vid'],
	usage: '{необходимо быть в голосовом канале}',
	dm: 0,
	args: 0,
	tier: 0,
  cooldown: 30
};

exports.run = (client, msg) => {
	if (!msg.member.voiceChannel) {
		client.userLib.retError(msg.channel, {id: msg.author.id, tag: msg.author.tag, displayAvatarURL: msg.author.displayAvatarURL}, 'Вы должны находиться в голосовом канале!');
		return;
	}

	let embed = new client.userLib.discord.RichEmbed()
		.setAuthor(msg.member.voiceChannel.name, msg.guild.iconURL)
		.setDescription(`[Включить видеотрансляцию](https://discordapp.com/channels/${msg.guild.id}/${msg.member.voiceChannel.id})`)
		.setColor(client.userLib.colors.inf);
	msg.channel.send(embed);
};