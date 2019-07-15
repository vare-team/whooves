
exports.help = {
    name: "say",
    description: "Написать от имени бота.",
    usage: "say [Текст]",
    flag: 2,
    cooldown: 500
}

let embed;

exports.run = (client, msg, args, Discord) => {

	client.db.queryValue('SELECT prefix FROM servers WHERE id = ?', [msg.guild.id], (err, prefix) => {

		let text = msg.content.slice(prefix.length+4);

		embed = new Discord.RichEmbed()
		.setColor(client.config.colors.inf)
		.setDescription(text)
		return msg.channel.send({embed});

	});

}; 