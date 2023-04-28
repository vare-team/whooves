import { respondError, respondSuccess } from '../../utils/respond-messages.js';
import { EmbedBuilder, PermissionsBitField, SlashCommandBuilder } from 'discord.js';
import logger, { generateErrLog } from '../../utils/logger.js';
import { sendLogChannel } from '../../services/guild-log.js';
import Command from '../../utils/Command.js';
import Warn from '../../models/warn.js';

const warnsCollection = {};
const warnsClears = {};

export default new Command(
	new SlashCommandBuilder()
		.setName('unwarn')
		.setDescription('reduce warns of user')
		.setNameLocalization('ru', 'снять_варн')
		.setDescriptionLocalization('ru', 'снимает варн с пользователя')
		.addUserOption(option =>
			option
				.setName('user')
				.setDescription('user to unwarn')
				.setNameLocalization('ru', 'пользователь')
				.setDescriptionLocalization('ru', 'пользователь у которого надо снять')
				.setRequired(true)
		)
		.addIntegerOption(option =>
			option
				.setName('warn_id')
				.setDescription('id of warn to remove')
				.setNameLocalization('ru', 'айди_варна')
				.setDescriptionLocalization('ru', 'варн который будет снят')
				.setAutocomplete(true)
				.setRequired(true)
		)
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages),
	run,
	autocomplete
);

async function run(interaction) {
	const user = interaction.options.getUser('user');
	const id = interaction.options.getInteger('warn_id');

	clearInterval(warnsClears[interaction.guildId]);
	warnsClears[interaction.guildId] = setInterval(() => {
		delete warnsCollection[interaction.guildId];
	}, 15e3);

	const warn = await Warn.destroy({ where: { id, userId: user.id, guildId: interaction.guildId } });

	if (!warn)
		return respondError(interaction, 'Тщательно проверив свои записи, я не нашёл предупреждения с такими данными.');

	if (warn > 1) logger(generateErrLog('unwarn', interaction, 'Удаление варнов сломалось!'));

	await respondSuccess(interaction, [new EmbedBuilder().setDescription(`С ${user} **снято предупреждение**.`)]);
	await sendLogChannel('commandUse', interaction.guild, {
		user: { tag: interaction.user.tag, id: interaction.user.id },
		channel: { id: interaction.channelId },
		content: `снятие предупреждения (ID:${id}) с ${user.id}`,
	});
}

/**
 *
 * @param interaction {AutocompleteInteraction}
 * @return {Promise<void>}
 */
async function autocomplete(interaction) {
	const target = interaction.options.get('user')?.value;

	let warns = warnsCollection[interaction.guildId];
	if (target) warns = warns?.[target];
	if (!warns) {
		const warnsInstances = await Warn.findAll({
			attributes: ['id', 'userId'],
			where: { ...(target && { userId: target }), guildId: interaction.guildId },
		});

		if (target) {
			if (!warnsCollection[interaction.guildId]) warnsCollection[interaction.guildId] = {};
			warnsCollection[interaction.guildId][target] = warnsInstances.map(w => w.id);
		} else {
			warnsCollection[interaction.guildId] = warnsInstances.reduce(
				(a, w) => ({ ...a, [w.userId]: [...(a[w.userId] ?? []), w.id] }),
				{}
			);
		}

		warns = warnsCollection[interaction.guildId];
		if (target) warns = warns[target];
	}

	warns = typeof warns === 'object' ? Object.values(warns).flat() : warns;
	if (warns.length > 25) warns = warns.slice(0, 25);
	await interaction.respond(warns.map(w => ({ name: w, value: w })));
}
