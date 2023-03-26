import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { respondSuccess } from '../../utils/respond-messages.js';
import Command from '../../utils/Command.js';
import Warn from '../../models/warn.js';

export default new Command(
	new SlashCommandBuilder()
		.setName('warns')
		.setDescription('show warns')
		.setNameLocalization('ru', 'варны')
		.setDescriptionLocalization('ru', 'показывает варны')
		.addUserOption(option =>
			option
				.setName('user')
				.setDescription('user of whose warns to show')
				.setNameLocalization('ru', 'пользователь')
				.setDescriptionLocalization('ru', 'пользователь чьи варны отобразить')
				.setRequired(false)
		)
		.setDMPermission(false),
	run
);

export async function run(interaction) {
	const user = interaction.options.getUser('user') ?? interaction.user;

	await interaction.deferReply();
	const warns = await Warn.findAll({ where: { userId: user.id, guildId: interaction.guildId } });

	const embed = new EmbedBuilder()
		.setAuthor({
			name: `${user.username}#${user.discriminator}`,
			iconURL: user.displayAvatarURL(),
		})
		.setTitle('Предупреждения')
		.setTimestamp();

	let descGenerator = `Количество предупреждений: **${warns.length}**\n\n`;
	for (const warn of warns)
		descGenerator += `(ID: **${warn.id}**); <@!${warn.whoId}>: ${warn.reason ?? 'Не указана'}\n`;
	embed.setDescription(descGenerator);

	await respondSuccess(interaction, embed, true);
}
