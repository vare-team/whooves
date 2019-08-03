function isValidHEX(code) {
    if(!code) return console.error("isValidHEX | Не указан HEX-код.");
    var re = (code.includes("#")) ? /#[0-9A-Fa-f]{6}/g : /[0-9A-Fa-f]{6}/g;
    
    if(re.test(code)) return true;
    else return false;
}

exports.help = {
    name: "color",
    description: "Выводит эмбед с указанным цветом",
    usage: "color [#HEX]",
    flag: 3,
    cooldown: 1000
};

exports.run = (client, msg, args, Discord) => {
    var embed = new Discord.RichEmbed();

	let color = args[0];
	if (!color) {embed.setColor(client.userLib.config.colors.err).setTitle('Ошибка!').setDescription('Вы не указали цвет!'); return msg.channel.send(embed);}
    if (isValidHEX(color) !== true) {embed.setColor(client.userLib.config.colors.err).setTitle('Ошибка!').setDescription('Вы указали некорректный цвет!').setTimestamp(); return msg.channel.send(embed);}
    embed.setColor(color).setTitle("Цвет " + color);
	return msg.channel.send(embed);
};