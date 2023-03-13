import filter from './filter.js';
import petpet from './petpet.js';
import roll from './roll.js';
import { SlashCommandBuilder } from 'discord.js';
import { mapAutocomplete, mapRunners, mapSubcommands } from '../../utils/functions.js';
import Commands from '../../models/Commands.js';

export default function () {
	const commands = [filter, petpet, roll];

	return new Commands(
		[
			mapSubcommands(
				new SlashCommandBuilder()
					.setName('images')
					.setDescription('images manipulation commands')
					.setNameLocalization('ru', 'изображения')
					.setDescriptionLocalization('ru', 'команды работы с изображениями'),
				commands.map(c => c.builder)
			),
		],
		mapRunners(commands),
		mapAutocomplete(commands)
	);
}
