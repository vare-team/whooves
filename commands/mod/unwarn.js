import { respondError, respondSuccess } from '../../utils/respond-messages.js';
import { PermissionsBitField, SlashCommandBuilder } from 'discord.js';
import logger, { generateErrLog } from '../../utils/logger.js';
import { sendLogChannel } from '../../services/guild-log.js';
import Command from '../../utils/Command.js';

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
		.addStringOption(option =>
			option
				.setName('warn_id')
				.setDescription('id of warn to remove')
				.setNameLocalization('ru', 'айди_варна')
				.setDescriptionLocalization('ru', 'варн который будет снят')
				.setAutocomplete(true)
				.setRequired(true)
		)
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionsBitField.Flags.ModerateMembers),
	run,
	autocomplete
);

export async function run(interaction) {
	const user = interaction.options.getUser('user');
	const id = interaction.options.getInteger('warn_id');

	clearInterval(warnsClears[user.id]);
	warnsClears[user.id] = setInterval(() => {
		delete warnsCollection[user.id];
	}, 15e3);

	if (!user || !id) return;

	//TODO: бдшка
	const warn = await promise(client.userLib.db, client.userLib.db.delete, 'warns', {
		userId: user.id,
		guildId: interaction.guildId,
		warnId: id,
	});

	if (!warn.res)
		return respondError(interaction, 'Тщательно проверив свои записи, я не нашёл предупреждения с такими данными.');

	if (warn.res > 1) logger(generateErrLog('unwarn', interaction, 'Удаление варнов сломалось!'));

	await respondSuccess(interaction, `С ${user} **снято предупреждение**.`);

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
	let options = [{ name: '', value: '' }];

	const target = interaction.command.options.getUser('user');
	if (!target) return await interaction.respond(options);

	//TODO: бдшка
	let warns = warnsCollection[target];
	if (!warns) {
		warns = db.getWarns(target);
		warnsCollection[target] = warns;
	}

	options = warns.map(w => {
		return { name: w, value: w };
	});

	await interaction.respond(options);
}
