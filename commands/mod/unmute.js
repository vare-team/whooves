exports.help = {
  name: "unmute",
  description: "Снять мут с участника",
	aliases: ['unm', 'um'],
  usage: [{type: 'user', opt: 0}],
	dm: 0,
  tier: -1,
  cooldown: 5
};

exports.run = async (client, msg) => {
	let mutedRole = (await client.userLib.promise(client.userLib.db, client.userLib.db.queryValue, 'SELECT mutedRole FROM guilds WHERE guildId = ?', [msg.guild.id])).res;
	if (!msg.guild.roles.has(mutedRole)) {client.userLib.retError(msg, 'Роли мута не существует.');return;}
	msg.magicMention.removeRole(mutedRole, 'Снятие мута!');
	client.userLib.db.delete('mutes', {userId: msg.magicMention.id, guildId: msg.guild.id}, () => {});

	msg.reply('мут снят!');
	client.userLib.sendLogChannel("commandUse", msg.guild, { user: { tag: msg.author.tag, id: msg.author.id, avatar: msg.author.displayAvatarURL }, channel: { id: msg.channel.id }, content: `снятие мута с ${msg.magicMention.user}`});
};