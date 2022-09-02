const {respondError} = require("../../utils/modules/respondMessages.js");
const {MessageEmbed} = require("discord.js");
const colors = require("../../models/colors.js");

export const help = {
	name: 'lookup',
	description: 'Информация о пользователе, гильдии или приглашении.',
};

export const command = {
	name: help.name,
	description: help.description,
	options: [
		{
			name: 'пользователь',
			description: 'Получить инофрмацию о пользователе',
			type: 1,
			options: [
				{
					name: 'пользователь',
					description: 'Пользователь',
					type: 6,
					required: true,
				},
			],
		},
		{
			name: 'id',
			description: 'Получить инофрмацию о ID',
			type: 1,
			options: [
				{
					name: 'id',
					description: 'ID публичной гильдии, приглашения или пользователя',
					type: 3,
					required: true,
					min_length: 16,
					maxlength: 19,

				},
			],
		},
	],
};

export async function run (interaction) {
	const client = interaction.client;
	const id = interaction.options.getString('id');
	let target = interaction.options.getMember('пользователь') || interaction.options.getUser('пользователь') || (await client.users.fetch(id).catch(() => 0));

	if (!target && /([0-9]){17,19}/.test(id)) {
		target = (await client.fetchInvite(id).catch(() => 0)) || (await client.fetchGuildPreview(id).catch(() => 0));
	}

	if (!target) {
		respondError(interaction, 'Пользователя/Приглашения/Гильдии с таким ID не найдено.');
		return;
	}

	let embed = new MessageEmbed()
		.setColor(colors.information)
		.setTimestamp();

	switch (target.constructor.name) {
		case 'ClientUser':
		case 'User':
			embed = await userEmbed(embed, target, interaction, client)
			break;
		case 'Invite':
			embed = await inviteEmbed(embed, target)
			break;
		case 'GuildPreview':
			embed = await guildEmbed(embed, target)
			break;
	}

	interaction.reply({ embeds: [embed], ephemeral: true });
}

async function guildEmbed (embed, guild){
	embed
		.setTitle('Публичная гильдия')
		.setAuthor(guild.name, `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.jpg?size=128`)
		.addFields([
			{
				name: 'Кол-во участников:',
				value: '``' + guild.approximateMemberCount + '``',
				inline: true
			},
			{
				name: 'Кол-во эмоджи:',
				value: '``' + guild.emojis.size + '``',
				inline: true
			},
			{
				name: 'Опции:',
				value: '```' + guild.features + '```',
			},
		])

	return embed
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
				value: '``' + invite.guild.id + '``',
				inline: true
			},
			{
				name: 'Канал:',
				value: '``#' + invite.channel.name + '``',
				inline: true
			},
			{
				name: 'Кол-во участников:',
				value: '``' + invite.memberCount + '``',
			},
			{
				name: 'Пригласивший:',
				value: '``' + `${invite.inviter.tag} (ID: ${invite.inviter.id})` + '``',
			},
		])

	return embed
}

async function userEmbed(embed, user, interaction, client) {
	let fields = [
		{
			name: 'Дата регистрации:',
			value: `<t:${Math.floor(user.createdAt / 1000)}:R>`,
			inline: true
		}
	]
	user.member = await client.guilds
		.resolve(interaction.guildId)
		.members.fetch(user.id)
		.catch(() => 0);

	embed
		.setTitle(user.bot ? 'Бот' : 'Пользователь')
		.setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }))
		.setThumbnail(user.displayAvatarURL({ dynamic: true }));

	if (user.member)
		fields.push({
			name: 'Дата присоединения к этой гильдии:',
			value: `<t:${Math.floor(user.member.joinedTimestamp / 1000)}:R>`,
			inline: true
		})

	if (user.flags.bitfield)
		fields.push({
			name: 'Значки:',
			value: '```' + user.flags.toArray() + '```'
		})

	embed.addFields(fields)
	return embed
}

export default {
	help,
	command,
	run
}

