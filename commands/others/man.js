import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import colors from '../../configs/colors.js';
import { crypt } from '../../utils/cryptor.js';

export const help = {
	name: 'man',
	description: 'Различные важные документы.',
	dm: 1,
	tier: 0,
	cooldown: 5,
	interactions: 1,
};

export const command = {
	name: help.name,
	description: help.description,
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
					autocomplete: true,
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
readdir('./assets/docs/', (err, files) => {
	if (err) throw err;
	files
		.filter(e => e.endsWith('.js'))
		.forEach(el => {
			try {
				docs[el.slice(0, -3)] = require(`../../assets/docs/${el}`);
				delete require.cache[require.resolve(`../../assets/docs/${el}`)];
			} catch (e) {
				console.warn(e);
			}
		});
	// console.log(Object.keys(docs));
});
//PARSE DOCS

//TODO upgrade
export function run(interaction) {
	if (interaction.options._subcommand === 'все') {
		const embed = new MessageEmbed()
			.setColor(colors.information)
			.setTitle(':paperclip: Список документов:')
			.setDescription(
				Object.keys(docs).reduce((pr, cr, ind) => (pr += `\`\`${ind + 1}.:\`\` ${cr}\n${docs[cr].description}\n\n`), '')
			);
		return interaction.reply({ embeds: [embed], ephemeral: true });
	}

	const docLang = interaction.options.getString('язык') ? interaction.options.getString('язык') : 'ru';

	const doc = docs[interaction.options.getString('название')];
	const embed = new MessageEmbed()
		.setColor(colors.information)
		.setTitle(`:mag_right: Документ: ${interaction.options.getString('название')}`);
	if (doc.source) embed.setURL(doc.source.link).setAuthor(doc.source.name);

	let text = doc.text[docLang] ? doc.text[docLang] : Object.values(doc.text)[0],
		page = 0;

	if (typeof text == 'string' && text.length < 2048) {
		embed.setDescription(text);
		return interaction.reply({ embeds: [embed], ephemeral: true });
	}
	if (typeof text == 'string') {
		text = text.match(/[\s\S]{1,2048}/g);
	}
	embed.setDescription(text[page]);

	const row = new MessageActionRow().addComponents(
		new MessageButton()
			.setCustomId(crypt([exports.help.name, interaction.user.id, embed.title.split(' ')[2], page, 'back', docLang]))
			.setLabel('Назад')
			.setStyle('PRIMARY')
			.setDisabled(page === 0),
		new MessageButton()
			.setCustomId('counter')
			.setLabel(`${page + 1} из ${text.length}`)
			.setStyle('SECONDARY')
			.setDisabled(true),
		new MessageButton()
			.setCustomId(crypt([exports.help.name, interaction.user.id, embed.title.split(' ')[2], page, 'next', docLang]))
			.setLabel('Вперёд')
			.setStyle('PRIMARY')
			.setDisabled(page === text.length - 1)
	);
	interaction.reply({ embeds: [embed], ephemeral: true, components: [row] });
}

export async function interaction(interaction) {
	let page = +args[3],
		text = docs[args[2]].text[args[1]] ? docs[args[5]].text[args[5]] : Object.values(docs[args[2]].text)[0],
		embed = new client.userLib.discord.MessageEmbed()
			.setColor(client.userLib.colors.inf)
			.setTitle(`:mag_right: Документ: ${args[2]}`);

	page = args[4] === 'next' ? page + 1 : page - 1;
	text = text.match(/[\s\S]{1,2048}/g);
	embed.description = text[page];
	const row = new client.userLib.discord.MessageActionRow().addComponents(
		new client.userLib.discord.MessageButton()
			.setCustomId(crypt([exports.help.name, args[1], args[2], page, 'back', args[5]]))
			.setLabel('Назад')
			.setStyle('PRIMARY')
			.setDisabled(page === 0),
		new client.userLib.discord.MessageButton()
			.setCustomId('counter')
			.setLabel(`${page + 1} из ${text.length}`)
			.setStyle('SECONDARY')
			.setDisabled(true),
		new client.userLib.discord.MessageButton()
			.setCustomId(crypt([exports.help.name, args[1], args[2], page, 'next', args[5]]))
			.setLabel('Вперёд')
			.setStyle('PRIMARY')
			.setDisabled(page === text.length - 1)
	);

	interaction.update({ embeds: [embed], ephemeral: true, components: [row] });
}

export async function autocomplete(client, interaction) {
	const documents = Object.keys(docs);
	const respond = [];

	for (const element of documents) {
		if (element.startsWith(interaction.options.getString('название')) && respond.length < 25)
			respond.push({
				name: element,
				value: element,
			});
	}

	interaction.respond(respond);
}
