import { respondError, respondSuccess } from '../../utils/respond-messages.js';
import { PermissionsBitField, SlashCommandBuilder, ChannelType, EmbedBuilder } from 'discord.js';
import Command from '../../utils/Command.js';

export default new Command(
	new SlashCommandBuilder()
		.setName('govoice')
		.setDescription('move all members from voice channel to another voice channel')
		.setNameLocalization('ru', 'перейти_в_голосовой')
		.setDescriptionLocalization('ru', 'Переместить всех в вашем голосовом канале в указанный канал')
		.addChannelOption(option =>
			option
				.setName('to')
				.setDescription('move TO channel')
				.setNameLocalization('ru', 'в')
				.setDescriptionLocalization('ru', 'канал В который переместить')
				.setRequired(true)
				.addChannelTypes(ChannelType.GuildVoice)
		)
		.addChannelOption(option =>
			option
				.setName('from')
				.setDescription('move FROM channel')
				.setNameLocalization('ru', 'с')
				.setDescriptionLocalization('ru', 'канал С которого переместить')
				.setRequired(false)
				.addChannelTypes(ChannelType.GuildVoice)
		)
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionsBitField.Flags.MoveMembers),
	run
);

async function run(interaction) {
	const newChannel = interaction.options.getChannel('to');
	const oldChannel = interaction.options.getChannel('from') ?? interaction.member.voice.channel ?? null;

	if (!oldChannel)
		return respondError(interaction, 'Вы должны находиться в голосовом канале или указать его в аргументе!');

	if (oldChannel.id === newChannel.id) return respondError(interaction, 'Новый канал совпадает со старым!');

	if (!oldChannel.viewable || !oldChannel.manageable || !newChannel.viewable || !newChannel.manageable)
		return respondError(interaction, 'У меня не хватает прав для взаимодействия с этими каналами!');

	if (oldChannel.members.size === 0) return respondError(interaction, 'В указанном канале пусто!');

	await interaction.deferReply();

	for (const [, member] of oldChannel.members) {
		await member.voice.setChannel(newChannel);
	}

	await respondSuccess(
		interaction,
		new EmbedBuilder().setDescription(`из <#${oldChannel}> перемещенны в <#${newChannel}>`)
	);
}
