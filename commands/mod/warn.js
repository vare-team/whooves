exports.help = {
  name: "warn",
  description: "Выдать предупреждение участнику",
	aliases: ['w'],
  usage: [{type: 'user', opt: 0},
  	      {type: 'text', opt: 1, name: 'причина'}],
	dm: 1,
	tier: -1,
  cooldown: 5
};

exports.run = (client, msg, args) => {

	client.userLib.db.insert('warns', {
		userId: msg.magicMention.id,
		guildId: msg.guild.id,
		who: msg.author.id,
		reason: args.slice(1).join(' ')
	}, () => {});

	let embed = new client.userLib.discord.RichEmbed()
		.setColor(client.userLib.colors.war)
		.setTitle(`${msg.magicMention.user.tag} выдано предупреждение!`)
		.setDescription('Причина:' + args.slice(1).join(' '))
		.setTimestamp()
		.setFooter(msg.author.tag, msg.author.avatarURL);

	msg.channel.send(embed);
	client.userLib.sendLogChannel("commandUse", msg.guild, { user: { tag: msg.author.tag, id: msg.author.id, avatar: msg.author.displayAvatarURL }, channel: { id: msg.channel.id }, content: `выдача предупреждения ${msg.magicMention.user} по причине: ${args.slice(1).join(' ')}`});
};