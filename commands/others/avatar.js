import { EmbedBuilder, SlashCommandSubcommandBuilder } from 'discord.js';
import { respondSuccess } from '../../utils/respond-messages.js';
import Command from '../../utils/Command.js';

export default new Command(
	new SlashCommandSubcommandBuilder()
		.setName('avatar')
		.setDescription('get user avatar')
		.setNameLocalization('ru', 'аватар')
		.setDescriptionLocalization('ru', 'взять аватар пользователя')
		.addUserOption(option =>
			option
				.setName('user')
				.setDescription('user whose avatar will be gathered')
				.setNameLocalization('ru', 'пользователь')
				.setDescriptionLocalization('ru', 'пользователь чья аватарка будет взята')
				.setRequired(false)
		),
	run
);

async function run(interaction) {
	const user = interaction.options.getUser('user') || interaction.user || interaction.user;

	const embed = new EmbedBuilder()
		.setDescription(`Аватар ${user}`)
		.setImage(user.displayAvatarURL({ dynamic: true, size: 2048 }))
		.setTimestamp();

	if (user.avatar && user.avatar.startsWith('a_')) embed.setFooter('GIF');

	await respondSuccess(interaction, embed);
}
