import { readdirSync, lstatSync } from 'fs'
import colors from "../../models/colors.js";
import {MessageEmbed} from "discord.js";
import {respondError} from "../../utils/modules/respondMessages.js";
import admins from "../../models/admins.js";
import {commands} from "../index.js";

export const help = {
	name: 'help',
	description: 'Список команд, позволяет узнать более подробную информацию о каждой команде.',
};

export const command = {
	name: 'help',
	description: 'Список команд, позволяет узнать более подробную информацию о каждой команде.',
	options: [
		{
			name: 'команда',
			description: 'название команды',
			type: 3,
			autocomplete: true,
		},
	],
};

const tiers = {
		'-3': 'Владельцу сервера',
		'-2': 'Администраторам сервера',
		'-1': 'Модераторам сервера',
		0: 'Всем пользователям',
		1: 'Не важно',
		2: 'Царям батюшкам',
	},
	modules = {
		dev: 'Команды разработчиков',
		fun: 'Развлечения',
		games: 'Игры',
		pony: 'Пони-команды',
		mod: 'Модерация и конфигурация',
		social: 'Социальные',
		others: 'Остальные',
		images: 'Работа с изображениями',
		context: 'Контекстные команды',
	};

export function run (interaction) {
	let cmds = Object.values(commands);
	let cmd = interaction.options.getString('команда');
	let fields = []
	let embed = new MessageEmbed().setColor(colors.information)

	if (!cmd) {
		embed.setDescription(`Вы можете написать \`/help [название команды]\` чтобы получить подробную информацию!`)
			.setTitle(':paperclip: Список команд:');

		for (let command of cmds.filter(x => x.help !== undefined)) {
			let helpData = command.help;
			fields.push({
				name: helpData.name,
				value: helpData.description,
				inline: true
			})
		}

		embed.addFields(fields)

		return interaction.reply({ embeds: [embed], ephemeral: true });
	}

	const command = cmds.filter(x => x.help && x.help.name === cmd)[0];

	if (!command) {
		respondError(
			interaction,
			'Возможно, в другой временной линии эта команда и есть, но тут пока ещё не добавили.'
		);
		return;
	}
	if (command.help.description)
		embed.setDescription(command.help.description);

	embed.setTitle(
		command.help.module === 'context'
			? '🖱️ Опция: ' + command.help.name
			: '🔎 Команда: ' + command.help.name);

	embed.addFields([{
		name: 'Использование',
		value: command.command.dm_permission
			? 'Только для гильдий'
			: 'ЛС И Гильдия'
	}])

	interaction.reply({ embeds: [embed], ephemeral: true });
}

export async function autocomplete (commands, interaction) {
	const respond = [];
	let cmd = interaction.options.getString('команда') || "";

	for (let element of commands) {
		if (element.help.name.toLowerCase().startsWith(cmd.toLowerCase()) && respond.length < 25)
			respond.push({
				name: element.help.name,
				value: element.help.name
			})
	}

	interaction.respond(respond)
}

export default {
	help,
	command,
	run,
	autocomplete
}
