exports.help = {
	name: 'man',
	description: 'Различные важные документы.',
	dm: 1,
	tier: 0,
	cooldown: 5,
	interactions: 1,
};

exports.command = {
	name: exports.help.name,
	description: exports.help.description,
	options: [
		{
			name: 'все',
			description: 'Список всех документов',
			type: 1,
		},
		{
			name: 'документ',
			description: 'Вывести документ',
			type: 1,
			options: [
				{
					name: 'название',
					description: 'Название документа',
					type: 3,
					required: true,
				},
				{
					name: 'язык',
					description: 'Язык документа',
					type: 3,
					required: false,
					choices: [
						{
							name: 'Русский',
							value: 'ru',
						},
						{
							name: 'Английский',
							value: 'en',
						},
					],
				},
			],
		},
	],
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

exports.run = (client, interaction) => {
	if (interaction.data.options.hasOwnProperty('все')) {
		let embed = new client.userLib.discord.MessageEmbed()
			.setColor(client.userLib.colors.inf)
			.setTitle(':paperclip: Список документов:')
			.setDescription(
				Object.keys(docs).reduce((pr, cr, ind) => (pr += `\`\`${ind + 1}.:\`\` ${cr}\n${docs[cr].description}\n\n`), '')
			);
		return client.userLib.replyInteraction(interaction, embed);
	}

	if (!docs[interaction.data.options['документ'].options[0].value])
		return client.userLib.retError(interaction, 'Документ не найден.');
	let docLang = interaction.data.options['документ'].options[1]
		? interaction.data.options['документ'].options[1].value
		: 'ru';

	let doc = docs[interaction.data.options['документ'].options[0].value];
	let embed = new client.userLib.discord.MessageEmbed()
		.setColor(client.userLib.colors.inf)
		.setTitle(':mag_right: Документ: ' + interaction.data.options['документ'].options[0].value)
	if (doc.source) embed.setURL(doc.source.link).setAuthor(doc.source.name);

	let text = doc.text[docLang] ? doc.text[docLang] : Object.values(doc.text)[0],
		page = 0,
		components = [];

	if (typeof text == 'string' && text.length < 2048) {
		embed.setDescription(text);
		client.userLib.replyInteraction(interaction, embed);
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
			client.userLib.getUser(interaction).user.id,
			embed.title.split(' ')[2],
			page,
			'back',
			docLang,
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
			client.userLib.getUser(interaction).user.id,
			embed.title.split(' ')[2],
			page,
			'next',
			docLang,
		]),
	});
	client.userLib.replyInteraction(interaction, embed, true, [{ type: 1, components: components }]);
};

exports.interaction = async (client, interaction, args) => {
	let components = [],
		page = +args[3],
		text = docs[args[2]].text[args[1]] ? docs[args[5]].text[args[5]] : Object.values(docs[args[2]].text)[0];
	let embed = new client.userLib.discord.MessageEmbed()
		.setColor(client.userLib.colors.inf)
		.setTitle(':mag_right: Документ: ' + args[2]);

	page = args[4] === 'next' ? page + 1 : page - 1;

	text = text.match(/[\s\S]{1,2048}/g);

	embed.description = text[page];

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
				embeds: [embed],
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
