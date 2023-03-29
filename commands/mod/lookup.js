import { respondError, respondSuccess } from '../../utils/respond-messages.js';
import { codeBlock, EmbedBuilder, GuildMember, Invite, SlashCommandBuilder } from 'discord.js';
import Command from '../../utils/Command.js';

export default new Command(
	new SlashCommandBuilder()
		.setName('lookup')
		.setDescription('info about guild ot user')
		.setNameLocalization('ru', 'поиск')
		.setDescriptionLocalization('ru', 'Информация о пользователе, гильдии или приглашении')
		.addSubcommand(command =>
			command
				.setName('user')
				.setDescription('user to find')
				.setNameLocalization('ru', 'пользователь')
				.setDescriptionLocalization('ru', 'пользователь которого нужно найти')
				.addUserOption(option =>
					option
						.setName('user')
						.setDescription('user to find')
						.setNameLocalization('ru', 'пользователь')
						.setDescriptionLocalization('ru', 'пользователь которого нужно найти')
						.setRequired(true)
				)
		)
		.addSubcommand(command =>
			command
				.setName('guild')
				.setDescription('guild id or invite code')
				.setNameLocalization('ru', 'сервер')
				.setDescriptionLocalization('ru', 'айди сервера или его код приглашения')
				.addStringOption(option =>
					option
						.setName('guild')
						.setDescription('guild id or invite code')
						.setNameLocalization('ru', 'сервер')
						.setDescriptionLocalization('ru', 'айди сервера или его код приглашения')
						.setMinLength(3)
						.setMaxLength(30)
						.setRequired(true)
				)
		),
	run
);

async function run(interaction) {
	const client = interaction.client;
	const id = interaction.options.getString('guild');
	const member = interaction.options.getMember('user') ?? interaction.options.getUser('user');
	const embed = new EmbedBuilder().setTimestamp();

	await interaction.deferReply({ ephemeral: true });
	if (member) {
		userEmbed(embed, member);
		if (member instanceof GuildMember) memberEmbed(embed, member);
		return await respondSuccess(interaction, [embed], true);
	}

	if (!id) {
		return respondError(interaction, 'Укажите параметр для поиска.');
	}

	const inviteData = Invite.InvitesPattern.exec(id);
	if (inviteData.length > 1) {
		const invite = await client.fetchInvite(inviteData[0])?.catch(() => 0);
		inviteEmbed(embed, invite);
	} else {
		const guild = await client.fetchGuildPreview(id)?.catch(() => 0);
		if (!guild) return respondError(interaction, 'Приглашения/Гильдии с таким ID не найдено.');
		guildEmbed(embed, guild);
	}

	await respondSuccess(interaction, [embed], true);
}

function guildEmbed(embed, guild) {
	embed
		.setTitle('Публичная гильдия')
		.setAuthor({ name: guild.name, iconURL: `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.jpg?size=128` })
		.addFields(
			{
				name: 'Кол-во участников:',
				value: codeBlock(guild.approximateMemberCount),
				inline: true,
			},
			{
				name: 'Кол-во эмоджи:',
				value: codeBlock(guild.emojis.size.toString()),
				inline: true,
			},
			{
				name: 'Опции:',
				value: codeBlock(guild.features),
			}
		);

	return embed;
}

function inviteEmbed(embed, invite) {
	embed
		.setTitle('Приглашение')
		.setAuthor({
			name: invite.guild.name,
			iconURL: `https://cdn.discordapp.com/icons/${invite.guild.id}/${invite.guild.icon}.jpg?size=128`,
		})
		.addFields(
			{
				name: 'ID гильдии:',
				value: codeBlock(invite.guild.id),
				inline: true,
			},
			{
				name: 'Канал:',
				value: `<#${invite.channelId}>`,
				inline: true,
			},
			{
				name: 'Кол-во участников:',
				value: codeBlock(invite.memberCount),
			},
			{
				name: 'Пригласивший:',
				value: codeBlock(`${invite.inviter.tag} (ID: ${invite.inviterId})`),
			}
		);

	return embed;
}

function userEmbed(embed, user) {
	const fields = [
		{
			name: 'Дата регистрации:',
			value: `<t:${Math.floor(user.createdAt / 1000)}:R>`,
			inline: true,
		},
	];
	const icon = user.displayAvatarURL({ forceStatic: false });

	embed
		.setTitle(user.bot ? 'Бот' : 'Пользователь')
		.setAuthor({ name: user.tag, iconURL: icon })
		.setThumbnail(icon);

	if (user.flags.bitfield)
		fields.push({
			name: 'Значки:',
			value: codeBlock(user.flags.toArray().toString()),
		});

	embed.addFields(fields);
}

function memberEmbed(embed, member) {
	embed.addFields({
		name: 'Дата присоединения к этой гильдии:',
		value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`,
		inline: true,
	});
}
