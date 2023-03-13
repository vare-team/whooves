import { respondError, respondSuccess } from '../../utils/modules/respondMessages.js';
import promise from '../../utils/promise.js';
import { codeBlock, EmbedBuilder, PermissionsBitField, SlashCommandBuilder } from 'discord.js';
import logger, { generateErrLog } from '../../utils/logger.js';
import Command from '../../models/Command.js';

export default new Command(
	new SlashCommandBuilder()
		.setName('ban')
		.setDescription('ban user')
		.setNameLocalization('ru', 'бан')
		.setDescriptionLocalization('ru', 'банит пользователя')
		.addUserOption(option =>
			option
				.setName('user')
				.setDescription('user to ban')
				.setNameLocalization('ru', 'пользователь')
				.setDescriptionLocalization('ru', 'пользователь которого надо забанить')
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName('reason')
				.setDescription('reason of ban')
				.setNameLocalization('ru', 'причина')
				.setDescriptionLocalization('ru', 'причина бана')
				.setRequired(false)
		)
		.addIntegerOption(option =>
			option
				.setName('clear_seconds')
				.setDescription('number of seconds to delete messages for')
				.setNameLocalization('ru', 'очстка_секунды')
				.setDescriptionLocalization('ru', 'кол-во секунд за которые нужно очистить сообщения')
				.setMinValue(0)
				.setMaxValue(604800)
				.setRequired(false)
		)
		.addStringOption(option =>
			option
				.setName('force')
				.setDescription('force ban ignore warns count')
				.setNameLocalization('ru', 'принудительно')
				.setDescriptionLocalization('ru', 'принудительный бан игнорируя кол-во варнов')
				.addChoices([
					{
						name: 'True',
						name_localizations: { ru: 'Да' },
						value: 'true',
					},
					{
						name: 'False',
						name_localizations: { ru: 'Нет' },
						value: 'false',
					},
				])
				.setRequired(false)
		)
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers),
	run
);

export async function run(interaction) {
	const member = interaction.options.getMember('user');
	const user = interaction.options.getUser('user');
	const clearmsg = interaction.options.getBoolean('clear_seconds') || 0;
	const reason = interaction.options.getString('причина') || 'Причина не указана';
	const force = interaction.options.getString('force') || false;

	if (member && !member.bannable)
		return await respondError(
			interaction,
			'Я не могу забанить этого участника!\nЕго защитная магия превосходит мои умения!'
		);

	if (!force) {
		//TODO: бдшка
		const warns = (
			await promise(client.userLib.db, client.userLib.db.count, 'warns', {
				userId: member.id,
				guildId: interaction.guildId,
			})
		).res;

		if (warns < 5)
			return respondError(interaction, 'Для выдачи бана необходимо **5** варнов!\nИли используйте аргумент `force`.');
	}

	await user
		.send(
			`Вам был выдан бан на сервере ${codeBlock(interaction.guild.name)}, модератором ${codeBlock(
				interaction.user.tag
			)}, по причине: ${reason}`
		)
		.catch(e => logger(generateErrLog('ban', interaction, e)));

	await interaction.guild.members.ban(user, {
		reason: `${interaction.user.tag}: ${reason}`,
		deleteMessageSeconds: clearmsg,
	});

	await respondSuccess(interaction, new EmbedBuilder().setDescription(`${member} **был забанен!** ***||*** ${reason}`));
}
