import { EmbedBuilder, PermissionsBitField, SlashCommandBuilder } from 'discord.js';
import { respondError, respondSuccess } from '../../utils/respond-messages.js';
import Command from '../../utils/Command.js';

export default new Command(
	new SlashCommandBuilder()
		.setName('clear')
		.setDescription('clear messages')
		.setNameLocalization('ru', 'очистка')
		.setDescriptionLocalization('ru', 'очищает сообщения')
		.addSubcommand(command =>
			command
				.setName('count')
				.setDescription('message count to clear')
				.setNameLocalization('ru', 'количество')
				.setDescriptionLocalization('ru', 'кол-во сообщений для очистки')
				.addIntegerOption(option =>
					option
						.setName('count')
						.setDescription('message count to clear')
						.setNameLocalization('ru', 'количество')
						.setDescriptionLocalization('ru', 'кол-во сообщений для очистки')
						.setMinValue(1)
						.setMaxValue(100)
						.setRequired(true)
				)
		)
		.addSubcommand(command =>
			command
				.setName('message_id')
				.setDescription('message id, after which you need to clear the chat')
				.setNameLocalization('ru', 'айди_сообщения')
				.setDescriptionLocalization('ru', 'айди сообщения до которого нужно очистить чат')
				.addStringOption(option =>
					option
						.setName('message_id')
						.setDescription('message id, after which you need to clear the chat')
						.setNameLocalization('ru', 'айди_сообщения')
						.setDescriptionLocalization('ru', 'айди сообщения до которого нужно очистить чат')
						.setMinLength(18)
						.setMinLength(21)
						.setRequired(true)
				)
		)
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages),
	run
);

async function run(interaction) {
	let count = interaction.options.getInteger('count');
	const message = interaction.options.getString('message_id');
	const channel = interaction.channel;

	if (message) {
		if (/([0-9]){18,21}/.test(message)) return await respondError(interaction, 'ID сообщения введено не верно!');

		const currentMsg = await channel.messages.fetch(message).catch(() => 0);
		if (!currentMsg || currentMsg.channel.id !== channel.id)
			return await respondError(interaction, 'Сообщение не найдено!');

		count = (await channel.messages.fetch()).filter(message => message.id >= currentMsg.id);
	}

	const dmsg = await channel.bulkDelete(count, true);
	const embed = new EmbedBuilder()
		.setTitle('Удаление сообщений')
		.setDescription(`Сообщения были удалены (**${dmsg.size}**)!`)
		.setTimestamp();

	await respondSuccess(interaction, embed);
}
