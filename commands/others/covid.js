exports.help = {
	name: "covid",
	description: "Информация о COVID-19",
	aliases: ['corona'],
	usage: [],
	dm: 1,
	tier: 0,
	cooldown: 5
};

function dots(text) {
	return text.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1 ");
}

exports.run = async (client, msg, args) => {
	let result = await client.userLib.request({url: `https://api.covid19api.com/summary`, json: true});

	let embed = new client.userLib.discord.MessageEmbed()
		.setTitle('📰 COVID-19 Информация')
		.setDescription(`
		🦠 Новых случаев заражения: **${dots(result.Global.NewConfirmed)}**\n🦠 Всего подтвержено: **${dots(result.Global.TotalConfirmed)}**\n
		☠ ️Новых летальных исходов: **${dots(result.Global.NewDeaths)}**\n☠ ️Всего летальных исходов: **${dots(result.Global.TotalDeaths)}**\n
		🏥 Новых случаев выздоровления: **${dots(result.Global.NewRecovered)}**\n🏥 Всего случаев выздоровления: **${dots(result.Global.TotalRecovered)}**
		
		__😷 Не забывай надевать маску!__
		
		*Информация предоставлена сайтом [covid19api.com](https://covid19api.com/)*
		`)
		.setFooter(msg.author.tag, msg.author.displayAvatarURL())
		.setColor(client.userLib.colors.war);

	msg.channel.send(embed);
};