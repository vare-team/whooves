exports.help = {
    name: "randog",
    description: "Случайная картинка с собакеным",
    usage: "",
    flag: 3,
    cooldown: 5000
};

exports.run = async (client, msg, args) => {
	msg.channel.startTyping();
	client.userLib.request('https://api.thedogapi.com/v1/images/search', {json: true}, (err, res, body) => {
		if(err) throw err;

		const embed = new client.userLib.discord.RichEmbed()
			.setAuthor(`Вот тебе случайный собакен 😄`)
			.setImage(body[0].url);

		msg.channel.stopTyping();
		msg.channel.send(embed);
	});
};