import { codeBlock, EmbedBuilder, PermissionsBitField, SlashCommandBuilder } from 'discord.js';
import { getClearNickname, isNicknameClear } from '../../utils/modules/nickname.js';
import { emoji, respondSuccess } from '../../utils/modules/respondMessages.js';
import Command from '../../models/Command.js';

export default new Command(
	new SlashCommandBuilder()
		.setName('correctall')
		.setDescription('nicknames correction')
		.setNameLocalization('ru', 'корректировка')
		.setDescriptionLocalization('ru', 'корректировка никнеймов')
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageNicknames),
	run
);

export async function run(interaction) {
	await interaction.deferReply();

	//const members = await interaction.guild.members.fetch({ force: true });
	const membersRaw = await interaction.guild.members.fetch();
	const members = membersRaw
		.filter(m => m.manageable && !isNicknameClear(m.displayName))
		.map(v => v)
		.slice(0, 24);
	const embed = new EmbedBuilder().setDescription('');
	let counter = 0;

	members.forEach(member => {
		if (counter < 25) {
			const name = member.displayName;

			const correctName = getClearNickname(name);
			member.edit({ nick: correctName }).then();

			if (checkDescriptionRange(embed, name, correctName)) {
				embed.setDescription(
					`${embed.description}${codeBlock((counter + 1).toString())}) ${name}#${member.user.discriminator} ${codeBlock(
						'=>'
					)} ${correctName}\n`
				);

				counter++;
			}
		}
	});

	if (counter) {
		embed.setTitle(`${emoji.ready} Отредактировано: ${counter}/${membersRaw.size}`).setDescription(embed.description);
	} else {
		embed.setTitle(`${emoji.ready} Изменений нет!`).setDescription('');
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
	const description = embed.data.description ? embed.data.description : '';
	return description.length + name.length + correctName.length + 28 < 2000;
}
