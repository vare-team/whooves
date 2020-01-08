exports.help = {
  name: "say",
  description: "Написать от имени бота.",
	aliases: ['s'],
  usage: "[текст]",
	dm: 0,
	tier: -2,
	cooldown: 5
};

exports.run = (client, msg, args) => {
	let embed = new client.userLib.discord.RichEmbed().setColor(client.userLib.colors.inf).setDescription(args.join(" "));
	msg.channel.send(embed);
	msg.delete();
};