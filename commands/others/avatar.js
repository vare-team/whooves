import { EmbedBuilder, SlashCommandSubcommandBuilder } from 'discord.js';
import { getMemberOrUser, respondSuccess } from '../../utils/respond-messages.js';
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
	const member = getMemberOrUser(interaction);

	const embed = new EmbedBuilder()
		.setDescription(`Аватар ${member}`)
		.setImage(member.displayAvatarURL({ forceStatic: false, size: 2048 }))
		.setTimestamp();

	if (member.avatar?.startsWith('a_') || member.user.avatar?.startsWith('a_')) embed.setFooter({ text: 'GIF' });
	await respondSuccess(interaction, [embed]);
}
