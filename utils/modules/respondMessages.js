import { MessageEmbed } from 'discord.js'
import colors from '../../models/colors.js'

export const emoji = {
	load: '<a:load:793027778554888202>',
	ready: '<a:checkmark:674326004252016695>',
	err: '<a:error:674326004872904733>',
	readyObj: { id: '849711299020849243', name: 'em1', animated: false },
	errObj: { id: '849711300082401310', name: 'em', animated: false },
};

/**
 * @function
 * @param interaction
 * @param {string} reason
 */
export const respondError = (interaction, reason = 'Какая разница вообще?') => {
	let embed = new MessageEmbed()
		.setColor(colors.error)
		.setDescription( emoji.err + ' **Ошибка:** ' + reason)

	if (interaction.deferred) interaction.editReply({ embeds: [embed], ephemeral: true })
	else interaction.reply({ embeds: [embed], ephemeral: true })
};

/**
 * @function
 * @param interaction
 * @param {string} reason
 */
export const respondSuccess = (interaction, reason = 'Какая разница вообще?') => {
	let embed = new MessageEmbed()
		.setColor(colors.success)
		.setDescription( emoji.ready + ' ' + reason)

	if (interaction.deferred) interaction.editReply({ embeds: [embed] })
	else interaction.reply({ embeds: [embed] })
}
