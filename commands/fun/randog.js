exports.help = {
  name: "randog",
  description: "Случайная картинка с собакеным",
	aliases: ['dog'],
  usage: "",
	dm: 0,
  tier: 0,
  cooldown: 5
};

exports.run = async (client, msg) => {
	msg.channel.startTyping();
	let body = await client.userLib.request({url: 'https://api.thedogapi.com/v1/images/search', json: true});

	const embed = new client.userLib.discord.RichEmbed()
		.setAuthor(`Вот тебе случайный собакен 😄`)
		.setImage(body[0].url);

	msg.channel.stopTyping();
	msg.channel.send(embed);
};