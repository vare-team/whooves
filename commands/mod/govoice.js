import {respondError, respondSuccess} from "../../utils/modules/respondMessages.js";

export const help = {
	name: 'govoice',
	description: 'Переместить всех в вашем голосовом канале в указанный канал.',
	extraPermissions: ['MOVE_MEMBERS'],
};

export const command = {
	name: help.name,
	description: help.description,
	options: [
		{
			name: 'куда',
			description: 'Голосовой канал, в который будут перемещены участники',
			type: 7,
			required: true,
			channel_types: [2],
		},
		{
			name: 'откуда',
			description: 'Голосовой канал, из которого будут перемещены участники',
			type: 7,
			channel_types: [2],
		},
	],
};

export async function run (interaction) {
	let newChannel = interaction.options.getChannel('куда'),
		  oldChannel = interaction.options.getChannel('откуда') || interaction.member.voice.channel || null;

	if (!oldChannel)
		return respondError(interaction, 'Вы должны находиться в голосовом канале или указать его в аргументе!');
	if (oldChannel.id === newChannel.id)
		return respondError(interaction, 'Новый канал совпадает со старым!');
	if (!oldChannel.viewable || !newChannel.viewable)
		return respondError(interaction, 'У меня не хватает прав для взаимодействия с этими каналами!');
	if (oldChannel.members.size === 0)
		return respondError(interaction, 'В указанном канале пусто!');

	oldChannel = await oldChannel.fetch();
	newChannel = await newChannel.fetch();

	if (!oldChannel.manageable || !newChannel.manageable)
		return respondError(interaction, 'Вы должны находиться в голосовом канале или указать его в аргументе!');

	await interaction.deferReply();

	for (const member of oldChannel.members) {
		await member[1].voice.setChannel(newChannel);
	}

	respondSuccess(interaction, `${oldChannel} **был перемещён в** ${newChannel}`);
}

export default {
	help,
	command,
	run
}
