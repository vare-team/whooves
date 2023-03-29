import { inlineCode, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { getClearNickname, isNicknameClear } from '../../utils/nickname.js';
import { checkPermissions, emoji, respondSuccess } from '../../utils/respond-messages.js';
import Command from '../../utils/Command.js';
import admins from '../../configs/admins.js';

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
	const members = membersRaw.filter(m => m.manageable && !isNicknameClear(m.displayName)).map(v => v);
	const embed = new EmbedBuilder().setDescription('');
	let counter = 0;

	const embeds = [];

	if (admins.find(interaction.user.id)) {
		for (let [i, s] = [0, 0], e = 24; i < members.size; s = 24 * i, e += e, i++) {
			counter = await clearMembers(members, counter, embed, s, e);
			if (counter) {
				embed.setTitle(`${emoji.ready} Отредактировано: ${counter}/${members.size}`).setDescription('');
				embeds.push(embed);
			}
			counter = 0;
		}
	} else {
		counter = await clearMembers(members, counter, embed);
		if (counter) {
			embed.setTitle(`${emoji.ready} Отредактировано: ${counter}/${members.size}`);
		}
		embeds.push(embed);
	}

	if (!counter) {
		embed.setTitle(`${emoji.ready} Изменений нет!`).setDescription(null);
	}

	for (let i = 0; i < embeds.length; i += 10) {
		await respondSuccess(interaction, embeds.slice(i, i + 10));
	}
}

async function clearMembers(members, counter, embed, start = 0, end = 24) {
	for (const member of members.slice(start, end)) {
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

	return counter;
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
