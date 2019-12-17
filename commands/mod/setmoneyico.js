exports.help = {
  name: "setmoneyico",
  description: "Задать иконку валюты на сервере",
	aliases: ['smi', 'setmi'],
  usage: "[символ]",
	dm: 0,
	args: 1,
  tier: -3,
  cooldown: 15
};

let embed;

exports.run = (client, msg, args, Discord) => {
	args[1].replace(':', '');
	if (!args[1]) return;
	if (args[1].length > 48) {embed = new Discord.RichEmbed().setColor(client.config.colors.err).setTitle('Ошибка!').setDescription(`Иконка экономики не должена быть больше 48 символов!`).setTimestamp();return msg.channel.send({embed});}

	client.db.upsert(`servers`, {id: msg.guild.id, moneyico: args[1]}, (err) => {
		embed = new Discord.RichEmbed().setColor(client.config.colors.suc).setTitle('Иконка экономики изменена!').setDescription(`Теперь иконка для вашего сервера это **${args[1]}**`).setTimestamp();
		return msg.channel.send({embed});
	})
	
}