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

let embed;

exports.run = (client, msg, args, Discord) => {

	if (!msg.mentions.members.first()) return;

	client.db.queryValue('SELECT muterole FROM users WHERE userId = ? AND guildId = ?', [msg.mentions.members.first().id, msg.guild.id], (err, muterole) => {
	
		if (!parseInt(muterole)) {embed = new Discord.RichEmbed().setColor(client.config.colors.err).setTitle('Ошибка!').setDescription('У участника нет мута!').setTimestamp();return msg.channel.send({embed});}
	
		msg.delete();

		client.db.queryValue('SELECT muterole FROM users WHERE userId = ? AND serid = ?', [msg.mentions.members.first().id, msg.guild.id], (err, muterole) => {
			if (!client.guilds.get(msg.guild.id).roles.get(muterole)) return;
			client.guilds.get(msg.guild.id).roles.get(muterole).delete();
			embed = new Discord.RichEmbed().setColor(client.config.colors.suc).setTitle('Мут снят').setDescription(`С **<@${msg.mentions.members.first().id}>** был снят мут`).setTimestamp();
			client.db.query(`UPDATE users SET muterole = 0 WHERE userId = ? AND serid = ?`, [msg.mentions.members.first().id, msg.guild.id], () => {});
			return msg.channel.send({embed}).then(msg => msg.delete(5000));
		});
	});
	
}