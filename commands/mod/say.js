exports.help = {
    name: "say",
    description: "Написать от имени бота.",
    usage: "say [Текст]",
	tier: 2,
	args: 1,
    cooldown: 500
};

exports.run = (client, msg, args) => {
	let embed = new client.userLib.discord.RichEmbed().setColor(client.userLib.colors.inf).setDescription(args.join(" "));
	msg.channel.send(embed);
}; 