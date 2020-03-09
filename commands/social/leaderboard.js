exports.help = {
  name: "leaderboard",
  description: "Таблица лидеров по валюте на сервере",
	aliases: ['lb'],
  usage: [],
	dm: 0,
  tier: 0,
  cooldown: 10
};

exports.run = (client, msg) => {
	client.userLib.db.query(`SELECT tag, money FROM users ORDER BY money DESC LIMIT 5`, (err, res) => {
		let embed = new client.userLib.discord.MessageEmbed()
	    .setAuthor(`${client.user.username} - Таблица лидеров`, client.user.displayAvatarURL())
	    .setColor(client.userLib.colors.inf)
			.setFooter(msg.author.tag, msg.author.displayAvatarURL());

		let generated = '';
	  res.forEach((item, i) => generated += `**${i+1}.** ${item.tag}: \`\`${item.money}\`\` \n`);
	  embed.setDescription(generated);

    msg.channel.send(embed);
	});
};