import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, SlashCommandSubcommandBuilder, ButtonStyle } from 'discord.js';
import colors from '../../configs/colors.js';
import bronystuff from '../../assets/docs/bronystuff.js';
import fullrules from '../../assets/docs/fullrules.js';
import rules from '../../assets/docs/rules.js';
import shortcuts from '../../assets/docs/shortcuts.js';
import Command from '../../utils/Command.js';
import { respondSuccess } from '../../utils/respond-messages.js';

const docs = { bronystuff, fullrules, rules, shortcuts };

export default new Command(
	new SlashCommandSubcommandBuilder()
		.setName('man')
		.setDescription('Various important documents')
		.setNameLocalization('ru', 'справка')
		.setDescriptionLocalization('ru', 'Различные важные документы')
		.addStringOption(option =>
			option
				.setName('name')
				.setDescription('document name')
				.setNameLocalization('ru', 'название')
				.setDescriptionLocalization('ru', 'название документа')
				.setRequired(true)
				.setAutocomplete(true)
		)
		.addStringOption(option =>
			option
				.setName('language')
				.setDescription('language of document')
				.setNameLocalization('ru', 'язык')
				.setDescriptionLocalization('ru', 'язык документа')
				.setChoices(
					{ name: 'Russian', name_localizations: { ru: 'Русский' }, value: 'ru' },
					{ name: 'English', name_localizations: { ru: 'Английский' }, value: 'en' }
				)
				.setRequired(false)
		),
	run,
	autocomplete,
	interaction
);

function run(interaction) {
	const name = interaction.options.getString('name');
	if (name === 'all') {
		const embed = new EmbedBuilder()
			.setColor(colors.information)
			.setTitle(':paperclip: Список документов:')
			.setDescription(
				Object.keys(docs).reduce((pr, cr, ind) => (pr += `\`\`${ind + 1}.:\`\` ${cr}\n${docs[cr].description}\n\n`), '')
			);

		return respondSuccess(interaction, embed, true);
	}

	const doc = docs[name];
	const language = interaction.options.getString('language') ?? 'ru';
	const embed = new EmbedBuilder().setColor(colors.information).setTitle(`:mag_right: Документ: ${name}`);
	if (doc.source) embed.setURL(doc.source.link).setAuthor({ name: doc.source.name });

	let text = doc.text[language] ?? Object.values(doc.text)[0];

	if (typeof text === 'string' && text.length < 2048) {
		embed.setDescription(text);
		return respondSuccess(interaction, embed, true);
	}

	if (typeof text === 'string') text = text.match(/[\s\S]{1,2048}/g);
	const page = 0;

	embed.setDescription(text[page]);

	const row = new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId([interaction.user.id, name, page, 'back', language].join(':'))
			.setLabel('Назад')
			.setStyle(ButtonStyle.Primary)
			.setDisabled(page === 0),
		new ButtonBuilder()
			.setCustomId('counter')
			.setLabel(`${page + 1} из ${text.length}`)
			.setStyle(ButtonStyle.Secondary)
			.setDisabled(true),
		new ButtonBuilder()
			.setCustomId([interaction.user.id, name, page, 'next', language].join(':'))
			.setLabel('Вперёд')
			.setStyle(ButtonStyle.Primary)
			.setDisabled(page === text.length - 1)
	);

	return respondSuccess(interaction, embed, true, [row]);
}

async function interaction(interaction) {
	const args = interaction.customId.split(':');
	const [userId, name, , action, language] = args;
	const embed = new EmbedBuilder().setColor(colors.information).setTitle(`:mag_right: Документ: ${name}`);
	let text = docs[name].text[userId] ? docs[language].text[language] : Object.values(docs[name].text)[0];
	let page = +args[2];

	page = action === 'next' ? page + 1 : page - 1;
	text = text.match(/[\s\S]{1,2048}/g);
	embed.setDescription(text[page]);
	const row = new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId([userId, name, page, 'back', language].join(':'))
			.setLabel('Назад')
			.setStyle(ButtonStyle.Primary)
			.setDisabled(page === 0),
		new ButtonBuilder()
			.setCustomId('counter')
			.setLabel(`${page + 1} из ${text.length}`)
			.setStyle(ButtonStyle.Secondary)
			.setDisabled(true),
		new ButtonBuilder()
			.setCustomId([userId, name, page, 'next', language].join(':'))
			.setLabel('Вперёд')
			.setStyle(ButtonStyle.Primary)
			.setDisabled(page === text.length - 1)
	);

	interaction.update({ embeds: [embed], ephemeral: true, components: [row] });
}

async function autocomplete(interaction) {
	const name = interaction.options.getString('name');
	const documents = ['all', ...Object.keys(docs)];

	if (name.length) interaction.respond(documents.filter(el => el.includes(name)).map(el => ({ name: el, value: el })));
	else interaction.respond(documents.map(el => ({ name: el, value: el })));
}
