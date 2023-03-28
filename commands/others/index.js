import { SlashCommandBuilder } from 'discord.js';
import Commands from '../../utils/Commands.js';
import ball from './8ball.js';
import avatar from './avatar.js';
import color from './color.js';
import info from './info.js';
import cryptor from './cryptor.js';
import man from './man.js';

export default function () {
	const commands = [ball, avatar, color, info, cryptor, man];

	return new Commands(
		[
			Commands.mapSubcommands(
				new SlashCommandBuilder()
					.setName('other')
					.setDescription('random commands and utils')
					.setNameLocalization('ru', 'прочее')
					.setDescriptionLocalization('ru', 'рандомные команды и утилиты'),
				commands.map(c => c.builder)
			),
		],
		Commands.mapRunners(commands),
		Commands.mapAutocomplete(commands),
		Commands.mapComponents(commands)
	);
}
