import about from './about.js';
import lang from './lang.js';
import unshorten from './unshorten.js';
import { mapAutocomplete, mapRunners } from '../../utils/functions.js';
import Commands from '../../models/Commands.js';

export default function () {
	const commands = [about, lang, unshorten];

	return new Commands(
		commands.map(x => x.builder),
		mapRunners(commands),
		mapAutocomplete(commands)
	);
}
