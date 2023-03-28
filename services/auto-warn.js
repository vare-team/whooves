import Warn from '../models/warn.js';
import { EmbedBuilder } from 'discord.js';
import { sendLogChannel } from './guild-log.js';

/**
 * @function
 * @param {object} user
 * @param {object} guild
 * @param {object} channel
 * @param {string} reason
 */
export default async function (user, guild, channel, reason) {
	const warn = await Warn.create({
		userId: user.id,
		guildId: guild.id,
		whoId: discordClient.user.id,
		reason: `[AUTO] ${reason}`,
	});

	const warnsCount = await Warn.count({ where: { guildId: guild.id, userId: user.id } });

	const embed = new EmbedBuilder()
		.setColor(this.colors.war)
		.setTitle(`${user.tag} выдано предупреждение!`)
		.setDescription(
			`Причина: **${reason ? reason : 'Не указана'}**\nВсего предупреждений: **${warnsCount}**\nID предупреждения: **${
				warn.id
			}**`
		)
		.setTimestamp();
	channel.send(embed);

	await sendLogChannel('commandUse', guild, {
		user: {
			tag: discordClient.user.tag,
			id: discordClient.user.id,
			avatar: discordClient.user.displayAvatarURL(),
		},
		channel: { id: channel.id },
		content: `выдача предупреждения (ID: ${warn.id}) ${user} по причине: ${reason}`,
	});
}
