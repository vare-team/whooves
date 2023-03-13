import colors from '../../models/colors.js';
import { EmbedBuilder } from 'discord.js';

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
	embed = embed.setColor(color || colors.success);
	const options = { embeds: [embed], components, files: files, ephemeral: ephemeral };

	if (interaction.deferred) return interaction.editReply(options);
	return interaction.reply(options);
}
