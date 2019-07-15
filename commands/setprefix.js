
exports.help = {
    name: "setprefix",
    description: "Задать префикс для бота на сервере",
    usage: "setprefix [символ]",
    flag: 1,
    cooldown: 500
}

let embed;

exports.run = (client, msg, args, Discord) => {
	if (!args[1]) return;
	if (args[1].length > 1) {embed = new Discord.RichEmbed().setColor(client.config.colors.err).setTitle('Ошибка!').setDescription(`Префикс бота должен быть не более 1 символа!`).setTimestamp();return msg.channel.send({embed});}

	client.db.upsert(`servers`, {id: msg.guild.id, prefix: args[1]}, (err) => {
		embed = new Discord.RichEmbed().setColor(client.config.colors.suc).setTitle('Префикс изменён!').setDescription(`Теперь префикс для вашего сервера это **${args[1]}**`).setTimestamp();
		msg.channel.send({embed});
	})

};