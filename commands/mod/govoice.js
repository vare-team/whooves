exports.help = {
	name: "govoice",
	description: "Переместить всех в вашем голосовом канале в указанный канал.",
	aliases: ['gv', 'merge'],
	usage: [{type: 'text', opt: 0, name: 'ID Канала'},
					{type: 'voice'}],
	dm: 0,
	tier: -1,
	cooldown: 15
};

exports.run = async (client, msg, args) => {

	let govoice = msg.guild.channels.cache.get(args[0]);

	if (!govoice || govoice.type != 'voice') {
		client.userLib.retError(msg, 'Вы указали не корректный ID голосового канала!');
		return;
	}

	let count = msg.member.voice.channel.members.size, error = '';

	for (let m of msg.member.voice.channel.members.array())
		await m.voice.setChannel(govoice).catch(() => {count--; error += m.user.tag + ', ';});

	client.userLib.retError(msg, 'Недостаточно прав для перемещения пользователя(ей): '+error.slice(0, -2));

	let embed = new client.userLib.discord.MessageEmbed()
		.setDescription(`Было перемещено участников: **${count}**, в канал "**${govoice.name}**"`)
		.setFooter(msg.author.tag, msg.author.displayAvatarURL())
		.setColor(client.userLib.colors.suc);

	msg.channel.send(embed);
};