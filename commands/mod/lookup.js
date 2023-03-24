import { respondError, respondSuccess } from '../../utils/respond-messages.js';
import { codeBlock, EmbedBuilder, Invite, SlashCommandBuilder } from 'discord.js';
import Command from '../../utils/Command.js';

export default new Command(
	new SlashCommandBuilder()
		.setName('lookup')
		.setDescription('info about guild ot user')
		.setNameLocalization('ru', 'поиск')
		.setDescriptionLocalization('ru', 'Информация о пользователе, гильдии или приглашении')
		.addUserOption(option =>
			option
				.setName('user')
				.setDescription('user to find')
				.setNameLocalization('ru', 'пользователь')
				.setDescriptionLocalization('ru', 'пользователь которого нужно найти')
				.setRequired(false)
		)
		.addStringOption(option =>
			option
				.setName('guild')
				.setDescription('guild id or invite code')
				.setNameLocalization('ru', 'сервер')
				.setDescriptionLocalization('ru', 'айди сервера или его код приглашения')
				.setMinLength(16)
				.setMaxLength(21)
				.setRequired(false)
		),
	run
);

export async function run(interaction) {
	const client = interaction.client;
	const id = interaction.options.getString('id');
	const user = interaction.options.getUser('user');
	const member = interaction.options.getMember('user') || interaction.options.getUser('user');
	const embed = new EmbedBuilder().setTimestamp();

	if (!member && !id) return respondError(interaction, 'Укажите пользователя или сервер.');

	if (member) await memberEmbed(await userEmbed(embed, user), member);
	if (!member && id) {
		const inviteData = Invite.InvitesPattern.exec(id);
		let invite = null;
		let guild = null;
		if (inviteData) {
			invite = await client.fetchInvite(inviteData[0]).catch(() => 0);
			await inviteEmbed(embed, invite);
		} else if (/([0-9]){16,21}/.test(id)) {
			guild = await client.fetchGuildPreview(id).catch(() => 0);
			await guildEmbed(embed, guild);
		}
		if (!guild && !invite) {
			return respondError(interaction, 'Пользователя/Приглашения/Гильдии с таким ID не найдено.');
		}
	}

	await respondSuccess(interaction, embed, true);
}

async function guildEmbed(embed, guild) {
	embed
		.setTitle('Публичная гильдия')
		.setAuthor({ name: guild.name, iconURL: `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.jpg?size=128` })
		.addFields([
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
			},
		]);

	return embed;
}

async function inviteEmbed(embed, invite) {
	embed
		.setTitle('Приглашение')
		.setAuthor(
			invite.guild.name,
			`https://cdn.discordapp.com/icons/${invite.guild.id}/${invite.guild.icon}.jpg?size=128`
		)
		.addFields([
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
			},
		]);

	return embed;
}

async function userEmbed(embed, user) {
	const fields = [
		{
			name: 'Дата регистрации:',
			value: `<t:${Math.floor(user.createdAt / 1000)}:R>`,
			inline: true,
		},
	];

	embed
		.setTitle(user.bot ? 'Бот' : 'Пользователь')
		.setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }))
		.setThumbnail(user.displayAvatarURL({ dynamic: true }));

	if (user.flags.bitfield)
		fields.push({
			name: 'Значки:',
			value: codeBlock(user.flags.toArray().toString()),
		});

	embed.addFields(fields);
	return embed;
}

async function memberEmbed(embed, member) {
	embed.addFields([
		{
			name: 'Дата присоединения к этой гильдии:',
			value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`,
			inline: true,
		},
	]);
	return embed;
}
