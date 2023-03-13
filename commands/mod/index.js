import ban from './ban.js';
import clearmsg from './clearmsg.js';
import correctall from './correctall.js';
import govoice from './govoice.js';
import kick from './kick.js';
import lookup from './lookup.js';
import settings from './settings.js';
import unban from './unban.js';
import unwarn from './unwarn.js';
import warn from './warn.js';
import warns from './warns.js';
import { mapAutocomplete, mapRunners } from '../../utils/functions.js';
import Commands from '../../models/Commands.js';

export default function () {
	const commands = [ban, clearmsg, correctall, govoice, kick, lookup, settings, unban, unwarn, warn, warns];

	return new Commands(
		commands.map(x => x.builder),
		mapRunners(commands),
		mapAutocomplete(commands)
	);
}
