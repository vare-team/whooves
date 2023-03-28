import { respondError } from './respond-messages.js';
import permissionMap from '../configs/permissions-array-translator.js';

/**
 *
 * @param interaction {BaseInteraction}
 * @param permissionsToCheck {PermissionsBitField}
 */
export default function (interaction, permissionsToCheck) {
	const missing = interaction.guild.members.me.permissions.missing(permissionsToCheck);

	if (missing.length > 0) {
		const permissions = missing.map(p => permissionMap[p]).join(', ');
		return respondError(
			interaction,
			`У бота отсутствуют права, необходимые для работы этой команды!\n\n**Требуемые права:** ${permissions}`
		);
	}

	return null;
}
