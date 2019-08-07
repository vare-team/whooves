exports.help = {
    name: "say",
    description: "Написать от имени бота.",
    usage: "say [Текст]",
    flag: 2,
    cooldown: 500
};

exports.run = (client, msg, args, Discord) => {
	var embed = new Discord.RichEmbed();
	var text = args.join(" ");
	if(!text) { embed.setColor(client.userLib.config.colors.err).setTitle('Ошибка!').setDescription(`Вы не ввели текст!`); return msg.channel.send(embed); }

	embed.setColor(client.userLib.config.colors.inf).setDescription(text);
	return msg.channel.send(embed);
}; 
