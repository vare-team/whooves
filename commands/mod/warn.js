import {MessageEmbed} from "discord.js";
import colors from "../../models/colors.js";
import {respondError} from "../../utils/modules/respondMessages.js";
import {boldText} from "../../utils/functions.js";

export const help = {
	name: 'warn',
	description: 'Выдать предупреждение участнику',
	usage: [
		{ type: 'user', opt: 0 },
		{ type: 'text', opt: 1, name: 'причина' },
	],
};

export const command = {
	name: help.name,
	description: help.description,
	options: [
		{
			name: 'участник',
			description: 'Участник сервера',
			type: 6,
			required: true,
		},
		{
			name: 'причина',
			description: 'Причина выдачи предупреждения',
			type: 3,
		},
	],
};

export async function run (interaction) {
	const reason = interaction.options.getString("причина") || 'Не указана'
	if (reason && reason.length > 300)
		return respondError(interaction, 'Причина не может содержать в себе более 300 символов!');

	const wUser = interaction.options.getUser("участник"),
		warn = await client.userLib.promise(client.userLib.db, client.userLib.db.insert,
			'warns',
				{
					userId: wUser.id,
					guildId: interaction.guildId,
					who: interaction.user.id,
					reason: reason,
				}
			),
		warnInfo = await client.userLib.promise(client.userLib.db, client.userLib.db.queryValue,
				'SELECT COUNT(*) FROM warns WHERE userId = ? AND guildId = ?',
				[
					wUser.id,
					interaction.guildId
				]
			);

	let embed = new MessageEmbed()
		.setColor(colors.warning)
		.setTitle(`${wUser.tag} выдано предупреждение!`)
		.setDescription(
			`Причина: ${boldText(reason)}\nВсего предупреждений: ${boldText(warnInfo.res)}\nID предупреждения: ${boldText(warn.res)}`
		)
		.setTimestamp();

	interaction.reply({ embeds: [embed] });

	await client.userLib.sendLogChannel('commandUse', interaction.guild, {
		user: { tag: interaction.user.tag, id: interaction.user.id },
		channel: { id: interaction.channelId },
		content: `выдача предупреждения (ID: ${warn.res}) ${wUser.id} по причине: ${reason}`,
	});
}

export default {
	help,
	command,
	run
}
