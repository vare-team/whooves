import { inlineCode, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { getClearNickname, isNicknameClear } from '../../utils/nickname.js';
import { checkPermissions, emoji, respondSuccess } from '../../utils/respond-messages.js';
import Command from '../../utils/Command.js';

export default new Command(
	new SlashCommandBuilder()
		.setName('correctall')
		.setDescription('nicknames correction')
		.setNameLocalization('ru', 'корректировка')
		.setDescriptionLocalization('ru', 'корректировка никнеймов')
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	run
);

async function run(interaction) {
	const check = checkPermissions(interaction, PermissionFlagsBits.ManageNicknames);
	if (check) return;

	await interaction.deferReply();

	const membersRaw = await interaction.guild.members.fetch();
	const members = membersRaw
		.filter(m => m.manageable && !isNicknameClear(m.displayName))
		.map(v => v)
		.slice(0, 24);
	const embed = new EmbedBuilder();
	let counter = 0;

	for (const member of members) {
		const name = member.displayName;
		const correctName = getClearNickname(name);

		if (checkDescriptionRange(embed, name, correctName)) {
			await member.edit({ nick: correctName });
			embed.setDescription(
				`${embed.data.description ?? ''}${inlineCode((counter + 1).toString())} ${name}#${
					member.user.discriminator
				} ${inlineCode('=>')} ${correctName}\n`
			);

			counter++;
		} else break;
	}

	if (counter) {
		embed.setTitle(`${emoji.ready} Отредактировано: ${counter}/${membersRaw.size}`);
	} else {
		embed.setTitle(`${emoji.ready} Изменений нет!`).setDescription(null);
	}

	await respondSuccess(interaction, embed);
}

/**
 *
 * @param embed {EmbedBuilder}
 * @param name
 * @param correctName
 * @return {boolean}
 */
function checkDescriptionRange(embed, name, correctName) {
	const description = embed.data.description ?? '';
	return description.length + name.length + correctName.length + 28 < 2000;
}
