import filter from './filter.js';
import petpet from './petpet.js';
import roll from './roll.js';
import { SlashCommandBuilder } from 'discord.js';
import Commands from '../../utils/Commands.js';

export default function () {
	const commands = [filter, petpet, roll];

	return new Commands(
		[
			Commands.mapSubcommands(
				new SlashCommandBuilder()
					.setName('images')
					.setDescription('images manipulation commands')
					.setNameLocalization('ru', 'изображения')
					.setDescriptionLocalization('ru', 'команды работы с изображениями'),
				commands.map(c => c.builder)
			),
		],
		Commands.mapRunners(commands),
		Commands.mapAutocomplete(commands)
	);
}
