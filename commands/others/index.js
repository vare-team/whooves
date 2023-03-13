import ball from './8ball.js';
import avatar from './avatar.js';
import color from './color.js';
import info from './info.js';
import cryptor from './cryptor';
import { mapAutocomplete, mapRunners, mapSubcommands } from '../../utils/functions.js';
import { SlashCommandBuilder } from 'discord.js';
import Commands from '../../models/Commands.js';

export default function () {
	const commands = [ball, avatar, color, info, cryptor];

	return new Commands(
		[
			mapSubcommands(
				new SlashCommandBuilder()
					.setName('other')
					.setDescription('random commands and utils')
					.setNameLocalization('ru', 'прочее')
					.setDescriptionLocalization('ru', 'рандомные команды и утилиты'),
				commands.map(c => c.builder)
			),
		],
		mapRunners(commands),
		mapAutocomplete(commands)
	);
}
