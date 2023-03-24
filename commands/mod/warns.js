import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { respondSuccess } from '../../utils/respond-messages.js';
import Command from '../../utils/Command.js';

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
	const user = interaction.options.getUser('user') || interaction.member || interaction.user;

	//TODO: бдшка
	let warns = await client.userLib.db
		.promise()
		.query('SELECT * FROM warns WHERE userId = ? AND guildId = ?', [user.id, interaction.guildId]);
	warns = warns[0];

	const embed = new EmbedBuilder()
		.setAuthor({
			name: `${user.username}#${user.discriminator}`,
			iconURL: user.displayAvatarURL(),
		})
		.setTitle('Предупреждения')
		.setTimestamp();

	let descGenerator = `Количество предупреждений: **${warns.length}**\n\n`;
	for (const warn of warns)
		descGenerator += `(ID: **${warn.warnId}**); <@!${warn.who}>: ${warn.reason ?? 'Не указана'}\n`;
	embed.setDescription(descGenerator);

	await respondSuccess(interaction, embed, true);
}
