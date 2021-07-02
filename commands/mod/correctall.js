exports.help = {
	name: 'correctall',
	description: 'Исправляет все никнеймы участников на сервере.',
	aliases: ['ca'],
	usage: [],
	dm: 0,
	tier: -2,
	cooldown: 300,
};

exports.run = async (client, msg) => {
	if (!msg.member.guild.me.hasPermission('MANAGE_NICKNAMES'))
		return client.userLib.retError(msg, 'Для этой команды необходимо право «Управление никнеймами»!');

	const embed = new client.userLib.discord.MessageEmbed()
		.setColor(client.userLib.colors.inf)
		.setFooter(msg.author.tag, msg.author.displayAvatarURL())
		.setTitle(client.userLib.emoji.load + ' Исправление никнеймов...');

	const msgEdit = await msg.channel.send(embed);

	await msg.guild.members.fetch();
	embed.setColor(client.userLib.colors.suc).setDescription('');

	let counter = 0;

	for (let member of msg.guild.members.cache.array()) {
		const name = member.displayName;

		if (member.manageable && !client.userLib.isUsernameCorrect(name) && counter < 25) {
			const correctName = client.userLib.getUsernameCorrect(name);
			await member.edit({ nick: correctName });

			if (embed.description.length + name.length + correctName.length + 28 < 2000)
				embed.setDescription(
					embed.description + `\`\`${counter + 1})\`\` ${name}#${member.user.discriminator} \`\`=>\`\` ${correctName}\n`
				);
			else break;

			counter++;
			await client.userLib.delay(1000);
		}
	}

	if (counter) {
		embed.setDescription(embed.description);
		embed.setTitle(client.userLib.emoji.ready + ' Отредактировано: ' + counter + '/' + msg.guild.memberCount);
	} else {
		embed.setDescription('');
		embed.setTitle(client.userLib.emoji.ready + ' Изменений нет!');
	}

	msgEdit.edit(embed);
};
