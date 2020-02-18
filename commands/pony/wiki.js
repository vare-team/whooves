exports.help = {
	name: "wiki",
	description: "Поиск по mlp.fandom.com",
	aliases: ['fandom', 'ponysearch', 'mlpsearch'],
	usage: "(запрос)",
	dm: 1,
	tier: 0,
	cooldown: 5
};

exports.run = async (client, msg, args) => {
	let embedErr = new client.userLib.discord.RichEmbed().setTitle('mlp.fandom.com статья 404').setDescription("По вашему запросу ничего не найдено.").setImage('https://derpicdn.net/img/view/2019/12/29/2233270.gif').setFooter(msg.author.tag, msg.author.displayAvatarURL).setColor(client.userLib.colors.war);

	let wikiId = (await client.userLib.request({url: `https://mlp.fandom.com/api/v1/Search/List?query=${escape(args[0])}&limit=1&minArticleQuality=10&batch=1&namespaces=0%2C14`, json: true}));
	if (!wikiId.total) {msg.channel.send(embedErr);return;}
	wikiId = wikiId.items[0].id;

	let wikiData = (await client.userLib.request({url: `https://mlp.fandom.com/api/v1/Articles/Details?ids=${wikiId}&abstract=500`, json: true}));
	wikiData = wikiData.items[Object.keys(wikiData.items)[0]];

	let embed = new client.userLib.discord.RichEmbed().setTitle(wikiData.title).setURL('https://mlp.fandom.com/'+wikiData.url).setDescription(wikiData.abstract).setThumbnail(wikiData.thumbnail).setColor(client.userLib.colors.inf).setFooter(msg.author.tag, msg.author.displayAvatarURL);

	msg.channel.send(embed);
};