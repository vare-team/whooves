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
 * @param embeds {[EmbedBuilder]}
 * @param ephemeral {boolean}
 * @param components {[ActionRowBuilder] | null}
 * @param color {string | null}
 * @param files {[AttachmentBuilder] | null}
 * @return {Promise<Message<BooleanCache<CacheType>>>}
 */
export async function respondSuccess(
	interaction,
	embeds,
	ephemeral = false,
	components = null,
	color = null,
	files = null
) {
	for (const e of embeds) e.setColor(color ?? colors.success);
	const options = { embeds: embeds, components, files: files, ephemeral: ephemeral };

	if (interaction.deferred) await interaction.editReply(options);
	else if (interaction.replied) await interaction.followUp(options);
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
 *
 * @param interaction {BaseInteraction}
 * @param permissionsToCheck {PermissionsBitField}
 */
export function checkPermissions(interaction, permissionsToCheck) {
	const missing = interaction.guild.members.me.permissions.missing(permissionsToCheck);

	if (missing.length > 0) {
		const permissions = missing.map(p => permissionsArrayTranslator[p]).join(', ');
		return respondError(
			interaction,
			`У бота отсутствуют права, необходимые для работы этой команды!\n\n**Требуемые права:** ${permissions}`
		);
	}

	return null;
}
