exports.help = {
	name: 'correctall',
	description: 'Исправляет все никнеймы участников на сервере.',
	extraPermissions: ['MANAGE_NICKNAMES']
};

exports.command = {
	name: exports.help.name,
	description: exports.help.description,
};

exports.run = async (client, interaction) => {
	const embed = new client.userLib.discord.MessageEmbed();

	await interaction.deferReply();

	await interaction.guild.members.fetch({ force: true });
	embed.setColor(client.userLib.colors.suc).setDescription('');

	let counter = 0;

	for (let member of interaction.guild.members.cache) {
		const name = member[1].displayName;

		if (member[1].manageable && !client.userLib.isUsernameCorrect(name) && counter < 25) {
			const correctName = client.userLib.getUsernameCorrect(name);
			await member[1].edit({ nick: correctName });

			if (embed.description.length + name.length + correctName.length + 28 < 2000)
				embed.setDescription(
					embed.description + `\`\`${counter + 1})\`\` ${name}#${member[1].user.discriminator} \`\`=>\`\` ${correctName}\n`
				);
			else break;

			counter++;
			await client.userLib.delay(500);
		}
	}

	if (counter) {
		embed.setDescription(embed.description);
		embed.setTitle(client.userLib.emoji.ready + ' Отредактировано: ' + counter + '/' + interaction.guild.memberCount);
	} else {
		embed.setDescription('');
		embed.setTitle(client.userLib.emoji.ready + ' Изменений нет!');
	}

	await interaction.editReply({ embeds: [embed] });
};
