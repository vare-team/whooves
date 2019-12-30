exports.help = {
  name: "unmute",
  description: "Снять мут с участника",
	aliases: ['unm', 'um'],
  usage: "[@кто]",
	dm: 0,
	args: 1,
  tier: -1,
  cooldown: 5
};

exports.run = async (client, msg, args) => {
	if (!msg.mentions.users.first()) {
		client.userLib.retError(msg.channel, msg.author);
		return;
	}

	let mutedRole = (await client.userLib.promise(client.userLib.db, client.userLib.db.queryValue, 'SELECT mutedRole FROM guilds WHERE guildId = ?', [msg.guild.id])).res;
	if (!msg.guild.roles.has(mutedRole)) {
		client.userLib.retError(msg.channel, msg.author);
		return;
	}
	msg.mentions.members.first().removeRole(mutedRole, 'Снятие мута!');

	//TODO база?

};