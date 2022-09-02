import {respondError, respondSuccess} from "../../utils/modules/respondMessages.js";

export const help = {
	name: 'settings',
	description: 'Настройки бота',
};

export const command = {
	name: help.name,
	description: help.description,
	options: [
		{
			name: 'badwords',
			description: 'Фильтр плохих слов в чате',
			type: 1,
			options: [
				{
					name: 'состояние',
					description: 'Состояние параметра',
					type: 5,
					required: true,
				},
			],
		},
		{
			name: 'autocorrector',
			description: 'Проверка никнейма участнкиа при его заходе',
			type: 1,
			options: [
				{
					name: 'состояние',
					description: 'Состояние параметра',
					type: 5,
					required: true,
				},
			],
		},
		{
			name: 'logchannel',
			description: 'Лог-канал',
			type: 1,
			options: [
				{
					name: 'канал',
					description: 'Канал для логов',
					type: 7,
					channel_types: [0],
				},
			],
		},
	],
};

const normalizeParametrs = {
	badwords: 'Фильтр плохих слов',
	autocorrector: 'Исправление никнеймов',
};

export async function run (interaction) {
	const subCommand = interaction.options.getSubcommand();
	const state = interaction.options.getBoolean('состояние');
	const channel = interaction.options.getChannel('канал');

	switch (subCommand) {
		case 'logchannel':
			if (!interaction.options.getChannel('канал'))
				client.userLib.sendLogChannel('commandUse', interaction.guild, {
					user: { tag: interaction.user.tag, id: interaction.user.id },
					channel: { id: interaction.channel.id },
					content: 'отключение лог-канала',
				});

			client.userLib.db.update(
				`guilds`,
				{ guildId: interaction.guildId, logchannel: channel ? channel.id : null },
				() => {}
			);

			return respondSuccess(interaction, !channel ? `**Лог канал отключен**!` : `${channel} **установлен как канал для логов!**`)
		default:
			if (!(await client.userLib.setSettings(interaction.guildId, subCommand, state)))
				return respondError(interaction, 'Параметр уже находится в этом значении!');

			return respondSuccess(interaction, `«\`${normalizeParametrs[subCommand]}\`» - **${state ? 'включен' : 'выключен'}**!`)
	}
}

export default {
	help,
	command,
	run
}
