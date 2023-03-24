import about from './about.js';
import lang from './lang.js';
import unshorten from './unshorten.js';
import Commands from '../../utils/Commands.js';

export default function () {
	const commands = [about, lang, unshorten];

	return new Commands(
		commands.map(x => x.builder),
		Commands.mapRunners(commands),
		Commands.mapAutocomplete(commands)
	);
}
