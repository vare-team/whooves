exports.help = {
	name: 'man',
	description: 'Различные важные документы.',
	aliases: ['m', 'doc'],
	usage: [
		{ type: 'text', opt: 0, name: '"ls"/имя документа' },
		{ type: 'text', opt: 1, name: 'en/ru' },
	],
	dm: 1,
	tier: 0,
	cooldown: 5,
	interactions: 1,
};

const { readdir } = require('fs'),
	docs = {};
//PARSE DOCS
readdir('./docs/', (err, files) => {
	if (err) throw err;
	files
		.filter(e => e.endsWith('.js'))
		.forEach(el => {
			try {
				docs[el.slice(0, -3)] = require(`../../docs/${el}`);
				delete require.cache[require.resolve(`../../docs/${el}`)];
			} catch (e) {
				console.warn(e);
			}
		});
	// console.log(Object.keys(docs));
});
//PARSE DOCS

exports.run = (client, msg, args) => {
	if (!['en', 'ru'].includes(args[1])) args[1] = '';

	if (args[0] != 'ls' && !docs[args[0]]) {
		client.userLib.retError(msg, 'Документ не найден.');
		return;
	}

	if (args[0] == 'ls') {
		let embed = new client.userLib.discord.MessageEmbed()
			.setColor(client.userLib.colors.inf)
			.setTitle(':paperclip: Список документов:')
			.setFooter(msg.author.tag, msg.author.displayAvatarURL())
			.setDescription(
				Object.keys(docs).reduce((pr, cr, ind) => (pr += `\`\`${ind + 1}.:\`\` ${cr}\n${docs[cr].description}\n\n`), '')
			);
		msg.channel.send(embed);
		return;
	}

	let doc = docs[args[0]];
	let embed = new client.userLib.discord.MessageEmbed()
		.setColor(client.userLib.colors.inf)
		.setTitle(':mag_right: Документ: ' + args[0])
		.setFooter(msg.author.tag, msg.author.displayAvatarURL());
	if (doc.source) embed.setURL(doc.source.link).setAuthor(doc.source.name);

	let text = doc.text[args[1]] ? doc.text[args[1]] : Object.values(doc.text)[0],
		page = 0,
		message = new client.userLib.discord.APIMessage(msg.author, {}),
		components = [];

	if (!msg.author.id || !embed || !msg.channel) return;

	if (typeof text == 'string' && text.length < 2048) {
		embed.setDescription(text);
		msg.channel.send(embed);
		return;
	}
	if (typeof text == 'string') {
		text = text.match(/[\s\S]{1,2048}/g);
	}

	embed.setDescription(text[page]);

	components.push({
		type: 2,
		label: 'Назад',
		style: 1,
		disabled: page == 0,
		custom_id: client.userLib.AEScrypt([
			exports.help.name,
			msg.author.id,
			embed.title.split(' ')[2],
			page,
			'back',
			args[1],
		]),
	});
	components.push({
		type: 2,
		label: `${page + 1} из ${text.length}`,
		style: 2,
		disabled: true,
		custom_id: 'disabled',
	});
	components.push({
		type: 2,
		label: 'Вперёд',
		style: 1,
		disabled: page == text.length - 1,
		custom_id: client.userLib.AEScrypt([
			exports.help.name,
			msg.author.id,
			embed.title.split(' ')[2],
			page,
			'next',
			args[1],
		]),
	});

	message.data = {
		embed: embed,
		components: [
			{
				type: 1,
				components: components,
			},
		],
	};

	msg.channel.send(message);
};

exports.interaction = async (client, interaction, args) => {
	let oldEmbed = interaction.message.embeds[0],
		components = [],
		page = +args[3],
		text = docs[args[2]].text[args[1]] ? docs[args[5]].text[args[5]] : Object.values(docs[args[2]].text)[0];

	if (!oldEmbed) return;

	page = args[4] === 'next' ? page + 1 : page - 1;

	text = text.match(/[\s\S]{1,2048}/g);

	oldEmbed.description = text[page];

	components.push({
		type: 2,
		label: 'Назад',
		style: 1,
		disabled: page == 0,
		custom_id: client.userLib.AEScrypt([exports.help.name, args[1], args[2], page, 'back', args[5]]),
	});
	components.push({
		type: 2,
		label: `${page + 1} из ${text.length}`,
		style: 2,
		disabled: true,
		custom_id: 'disabled',
	});
	components.push({
		type: 2,
		label: 'Вперёд',
		style: 1,
		disabled: page == text.length - 1,
		custom_id: client.userLib.AEScrypt([exports.help.name, args[1], args[2], page, 'next', args[5]]),
	});

	client.api.interactions(interaction.id, interaction.token).callback.post({
		data: {
			type: 7,
			data: {
				embeds: [oldEmbed],
				components: [
					{
						type: 1,
						components: components,
					},
				],
			},
		},
	});
};
