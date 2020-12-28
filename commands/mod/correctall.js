exports.help = {
	name: "correctall",
	description: "Исправляет все никнеймы участников на сервере.",
	aliases: ['ca'],
	usage: [],
	dm: 0,
	tier: -3,
	cooldown: 300
};

exports.run = async (client, msg) => {

	let counter = 0
		, name
		, correctName;

	if (!msg.member.guild.me.hasPermission('MANAGE_NICKNAMES')) return client.userLib.retError(
			msg,
			'Для этой команды необходимо право «Управление никнеймами»!'
		);

	let embed = new client.userLib.discord.MessageEmbed()
		.setColor(client.userLib.colors.inf)
		.setFooter(msg.author.tag, msg.author.displayAvatarURL())
		.setTitle(client.userLib.emoji.load + ' Исправление никнеймов...');

	let msgEdit = await msg.channel.send(embed);

	await msg.guild.members.fetch();

	embed
		.setColor(client.userLib.colors.suc)
		.setDescription('');

	for (let member of msg.guild.members.cache.array()) {
		name = member.displayName;
		correctName = client.userLib.getUsernameCorrect(name);

		if (member.manageable && !client.userLib.isUsernameCorrect(name) && counter < 25) {
			await member.edit({nick: correctName});

			if (embed.description.length + name.length + correctName.length + 28 < 2000)
				embed.setDescription(
					embed.description + `\`\`${counter + 1})\`\` ${name}#${member.user.discriminator} \`\`=>\`\` ${correctName}\n`
				);

			counter++;
			await client.userLib.delay(1000);
		}
	}

	if (counter) embed.setTitle(client.userLib.emoji.ready + " Отредактировано: " + counter + '/' + msg.guild.memberCount);
	else embed.setTitle(client.userLib.emoji.ready + " Изменений нет!");

	msgEdit.edit(embed);
};