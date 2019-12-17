exports.help = {
  name: "setbalance",
  description: "Установить баланс участнику",
	aliases: ['sb'],
  usage: "[@кто] [кол-во]",
	dm: 0,
	args: 1,
  tier: 1,
  cooldown: 5
};

let embed;

exports.run = (client, msg, args, Discord) => {
	
	if (!args[2]) return;
	if (!parseInt(args[2]) && args[2] != 0) {embed = new Discord.RichEmbed().setColor(client.config.colors.err).setTitle('Ошибка!').setDescription(`Баланс может быть только числом!`).setTimestamp();return msg.channel.send({embed});}
	
	let money = parseInt(args[1]);

	if (!msg.mentions.members.first()) {embed = new Discord.RichEmbed().setColor(client.config.colors.err).setTitle('Ошибка!').setDescription(`Нужно указать, кому установить баланс!`).setTimestamp();return msg.channel.send({embed});}
	
	client.db.query(`UPDATE users SET coins = ? WHERE id = ? AND serid = ?`, [money, msg.mentions.members.first().id, msg.guild.id]);
	embed = new Discord.RichEmbed().setColor(client.config.colors.suc).setTitle('Установка баланса').setDescription(`<@${msg.author.id}> установил <@${msg.mentions.members.first().id}> баланс **${args[2]}**`).setTimestamp();
	msg.channel.send({embed});

};