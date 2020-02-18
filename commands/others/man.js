exports.help = {
	name: "man",
	description: "Различные важные документы.",
	aliases: ['m', 'doc'],
	usage: '["ls"/имя_документа] (en/ru)',
	dm: 1,
	tier: 0,
	cooldown: 5
};

const { readdir } = require("fs")
		, docs = {}
;

//PARSE DOCS
readdir('./docs/', (err, files) => {
	if (err) throw err;
	files.filter(e => e.endsWith('.js')).forEach(el => {
		try {
			docs[el.slice(0, -3)] = require(`../../docs/${el}`);
			delete require.cache[require.resolve(`../../docs/${el}`)];
		} catch (e) { console.warn(e) }
	});
	console.log(Object.keys(docs));
});
//PARSE DOCS

exports.run = (client, msg, args) => {
	if (args[0] != 'ls' && !docs[args[0]]) {
		client.userLib.retError(msg.channel, msg.author, 'Документ не найден.');
		return;
	}

	if (args[0] == 'ls') {
		let embed = new client.userLib.discord.RichEmbed()
			.setColor(client.userLib.colors.inf)
			.setTitle(':paperclip: Список документов:')
			.setFooter(msg.author.tag, msg.author.displayAvatarURL)
			.setDescription(Object.keys(docs).reduce((pr, cr, ind) => pr += `\`\`${ind + 1}.:\`\` ${cr}\n${docs[cr].description}\n\n`, ''));
		msg.channel.send(embed);
		return;
	}

	let doc = docs[args[0]];
	let embed = new client.userLib.discord.RichEmbed()
		.setColor(client.userLib.colors.inf)
		.setTitle(':mag_right: Документ: ' + args[0])
		.setFooter(msg.author.tag, msg.author.displayAvatarURL)
	;
	if (doc.source) embed.setURL(doc.source.link).setAuthor(doc.source.name);

	pagesEmbed({id: msg.author.id, embed: embed, channel: msg.channel}, doc.text[args[1]] ? doc.text[args[1]] : Object.values(doc.text)[0]);
};

/**
 * @author MegaVasiliy007
 * @function pagesEmbed
 * @async
 * @param {Object} data
 * @param {string} data.id
 * @param {Object} data.embed
 * @param {Object} data.channel
 * @param {string | Array} text
 * @param {Object} devData
 * @param {number} devData.page
 * @param {string} devData.title
 * @param {Object} [devData.msg]
 * @returns {Promise<void>}
 */
async function pagesEmbed(data = {}, text = '', devData = {page: 0, title: ''}) {
	if (!data.id || !data.embed || !data.channel) {return;}

	if (typeof text == 'string' && text.length < 2048) {data.embed.setDescription(text);data.channel.send(data.embed);return;}
	if (typeof text == 'string') {text = text.match(/[\s\S]{1,2048}/g);}
	if (!devData.title) devData.title = data.embed.title;

	data.embed.setDescription(text[devData.page])
		.setTitle(devData.title + ` [${devData.page+1}/${text.length}]`);
	if (devData.msg) await devData.msg.edit(data.embed);
	else devData.msg = await data.channel.send(data.embed);

	if (devData.page != 0) await devData.msg.react('◀️');
	if (devData.page != text.length - 1) await devData.msg.react('▶️');

	let collector = await devData.msg.awaitReactions(
		(reaction, user) => ['◀️', '▶️'].indexOf(reaction.emoji.name) != -1 && user.id == data.id,
		{max: 1, time: 15000}).then(coll => coll.first() ? coll.first().emoji.name : 0);
	await devData.msg.clearReactions();
	if (!collector) return;

	if (collector == '◀️' && devData.page > 0) {devData.page--;}
	else if (collector == '▶️' && devData.page < text.length - 1) {devData.page++;}

	pagesEmbed(data, text, devData);
}