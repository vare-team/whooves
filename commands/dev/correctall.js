exports.help = {
	name: "correctall",
	description: "Исправляет все никнеймы.",
	aliases: [],
	usage: [],
	dm: 0,
	tier: 1,
	cooldown: 1
};

exports.run = async (client, msg) => {

	let counter = 0;

	let embed = new client.userLib.discord.MessageEmbed()
		.setColor(client.userLib.colors.suc)
		.setFooter(msg.author.tag, msg.author.displayAvatarURL())
		.setDescription('Никнеймы: \n');

	for (let member of msg.guild.members.cache.array()) {
		let name = member.displayName
			, correctName = client.userLib.getUsernameCorrect(name)
		;

		if (member.manageable && !client.userLib.isUsernameCorrect(name)) {
			await member.edit({nick: correctName});
			embed.setDescription(embed.description + `\`\`${name}#${member.user.discriminator}\`\` => \`\`${correctName}\`\`\n`);
			counter++;
		}
	}

	embed.setAuthor(counter + '/' + msg.guild.memberCount + ' отредактировано');
	msg.channel.send(embed)

};