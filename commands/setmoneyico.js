exports.help = {
    name: "setmoneyico",
    description: "Задать иконку валюты на сервере",
    usage: "setmoneyico [символ]",
    flag: 1,
    cooldown: 500
};

exports.run = (client, msg, args, Discord) => {
	var embed = new Discord.RichEmbed();

	let mico = args[0];
	if(!mico) {embed.setColor(client.userLib.config.colors.err).setTitle('Ошибка!').setDescription(`Вы не указали иконку экономики!`);return msg.channel.send(embed);}
	if (mico > 6) {embed.setColor(client.config.colors.err).setTitle('Ошибка!').setDescription(`Иконка не должна быть больше 6 символов!`);return msg.channel.send(embed);}

	client.userLib.db.upsert(`guilds`, {id: msg.guild.id, moneyico: mico}, (err) => {
		embed
			.setColor(client.config.colors.suc)
			.setTitle('Иконка экономики изменена!')
			.setDescription(`Теперь иконка для вашего сервера это **${args[1]}**`)
			.setTimestamp();
		return msg.channel.send(embed);
	});
};