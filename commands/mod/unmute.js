exports.help = {
  name: "unmute",
  description: "Снять мут с участника",
	aliases: ['unm', 'um'],
  usage: "[@кто]",
	dm: 0,
  tier: -1,
  cooldown: 5
};

exports.run = async (client, msg) => {
	let mutedRole = (await client.userLib.promise(client.userLib.db, client.userLib.db.queryValue, 'SELECT mutedRole FROM guilds WHERE guildId = ?', [msg.guild.id])).res;
	if (!msg.guild.roles.has(mutedRole)) {client.userLib.retError(msg.channel, msg.author, 'Роли мута не существует.');return;}
	msg.mentions.members.first().removeRole(mutedRole, 'Снятие мута!');
	client.userLib.db.delete('mutes', {userId: msg.mentions.users.first().id, guildId: msg.guild.id}, () => {});

	msg.reply('мут снят!');
};