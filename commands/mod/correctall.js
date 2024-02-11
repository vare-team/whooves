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
	const isAdmin = admins.includes(interaction.user.id);
	const size = members.length;
	const embeds = [];

	if (!size) {
		pushEmbed(embeds, new EmbedBuilder(), 0, 0);
	} else if (isAdmin) {
		let count = 0;
		while (count < size) {
			const embed = new EmbedBuilder();
			const counter = await clearMembers(members, embed, count);
			pushEmbed(embeds, embed, counter, size);
			count += counter;
			await interaction.editReply(`\`${count}\`/\`${size}\`[\`${(count / size) * 100}\`%]`);
		}
	} else {
		const embed = new EmbedBuilder();
		const counter = await clearMembers(members.slice(0, 24), embed);
		pushEmbed(embeds, embed, counter, size);
	}

	for (let i = 0; i < embeds.length; i += 10) {
		await respondSuccess(interaction, embeds.slice(i, i + 10));
	}
}

/**
 *
 * @param members {[GuildMember]}
 * @param count {number}
 * @param embed {EmbedBuilder}
 * @return {Promise<*>}
 */
async function clearMembers(members, embed, count = 0) {
	let counter = 0;
	while (members.length) {
		const member = members.shift();
		const name = member.displayName;
		const correctName = getClearNickname(name);

		if (checkDescriptionRange(embed, name, correctName)) {
			await member.edit({ nick: correctName });
			counter++;
			embed.setDescription(
				`${embed.data.description ?? ''}${inlineCode((count + counter).toString())} ${name}#${
					member.user.discriminator
				} ${inlineCode('=>')} ${correctName}\n`
			);
		} else break;
	}

	return counter;
}

/**
 *
 * @param counter {number}
 * @param embed {EmbedBuilder}
 * @param size {number}
 * @param embeds {[EmbedBuilder]}
 */
function pushEmbed(embeds, embed, counter, size) {
	if (counter) embed.setTitle(`${emoji.ready} Отредактировано: ${counter}/${size}`);
	else embed.setTitle(`${emoji.ready} Изменений нет!`).setDescription(null);
	embeds.push(embed);
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
	return description.length + name.length + correctName.length + 28 < 4096;
}
