exports.help = {
    name: "color",
    description: "Выводит эмбед с указанным цветом",
    usage: "color [#HEX]",
    tier: 3,
    args: 1,
    cooldown: 1000
};

exports.run = (client, msg, args) => {
    let embed = new client.userLib.discord.RichEmbed();

    if (/(#|)([a-fA-F0-9]{6}|[a-fA-F0-9]{3})/g.test(args[0])) {
        embed.setColor(client.userLib.config.colors.err).setTitle('Ошибка!').setDescription('Вы указали некорректный цвет!').setTimestamp(); 
        msg.channel.send(embed);
        return;
    }
    
    embed.setColor(args[0]).setTitle("Цвет " + args[0]);
	msg.channel.send(embed);
};