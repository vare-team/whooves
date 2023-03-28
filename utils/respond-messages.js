import colors from '../configs/colors.js';
import { EmbedBuilder } from 'discord.js';
import permissionsArrayTranslator from '../configs/permissions-array-translator.js';

export const emoji = {
	load: '<a:load:793027778554888202>',
	ready: '<a:checkmark:674326004252016695>',
	err: '<a:error:674326004872904733>',
	readyObj: { id: '849711299020849243', name: 'em1', animated: false },
	errObj: { id: '849711300082401310', name: 'em', animated: false },
};

/**
 *
 * @param interaction
 * @param message {string}
 * @return {Promise<Message<BooleanCache<CacheType>>>}
 */
export function respondError(interaction, message) {
	const embed = new EmbedBuilder().setTitle('Ошибка').setDescription(`${emoji.err} ${message}`).setColor(colors.error);
	const options = { embeds: [embed], ephemeral: true };

	if (interaction.deferred) return interaction.editReply(options);
	return interaction.reply(options);
}

/**
 *
 * @param interaction
 * @param embed {EmbedBuilder}
 * @param ephemeral {boolean}
 * @param components {[ActionRowBuilder] | null}
 * @param color {string | null}
 * @param files {[AttachmentBuilder] | null}
 * @return {Promise<Message<BooleanCache<CacheType>>>}
 */
export async function respondSuccess(
	interaction,
	embed,
	ephemeral = false,
	components = null,
	color = null,
	files = null
) {
	embed = embed.setColor(color ?? colors.success);
	const options = { embeds: [embed], components, files: files, ephemeral: ephemeral };

	if (interaction.deferred) await interaction.editReply(options);
	else await interaction.reply(options);
}

export function getMemberOrUser(interaction) {
	return (
		interaction.options.getMember('user') ??
		interaction.options.getUser('user') ??
		interaction.member ??
		interaction.user
	);
}

/**
 * @function
 * @param {Array<string>} array
 * @returns {Array<string>}
 */
export function permissionsArrayToString(array) {
	return array.map(el => permissionsArrayTranslator[el]);
}
