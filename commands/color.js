
exports.help = {
    name: "color",
    description: "Выводит эмбент с указанным цветом",
    usage: "color [#HEX]",
    flag: 3,
    cooldown: 1000
}


exports.run = (client, msg, args, Discord) => {

	let color = parseInt(msg.content.split("#")[1], 16);

	if (!color || 16777215 < color || 0 > color) {embed = new client.discord.RichEmbed().setColor(client.config.colors.err).setTitle('Ошибка!').setDescription('Не корректный цвет!').setTimestamp();return msg.channel.send({embed});}

	embed = new Discord.RichEmbed().setColor(color).setTitle("#" + msg.content.split("#")[1].toUpperCase())

	msg.channel.send({embed})

};