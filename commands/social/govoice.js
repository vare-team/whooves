exports.help = {
	name: "govoice",
	description: "Переместить всех в вашем голосовом канале в указанный канал.",
	aliases: ['gv'],
	usage: "{подключение} [ID Канала]",
	dm: 0,
	tier: -1,
	cooldown: 15
};

exports.run = (client, msg, args) => {

	let govoice = msg.guild.channels.get(args[0]);

	if (!govoice || govoice.type != 'voice') {
		client.userLib.retError(msg.channel, msg.author, 'Вы указали не корректный ID голосового канала!');
		return;
	}

	let count = msg.member.voiceChannel.members.size;

	for (let m of msg.member.voiceChannel.members.array()) m.setVoiceChannel(args[0]);

	let embed = new client.userLib.discord.RichEmbed()
		.setDescription(`Было перемещено участников: **${count}**, в канал "**${govoice.name}**"`)
		.setFooter(msg.author.tag, msg.author.displayAvatarURL)
		.setColor(client.userLib.colors.suc);

	msg.channel.send(embed);
};