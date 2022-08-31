import about from './about.js';
import lang from './lang.js';
// import ticker from './ticker.js'
import unshorten from './unshorten.js'
import {mapCommand} from "../../utils/functions.js";

export default {
	__category__: {
		name: 'Контекстные команды',
		onlyGuild: true,
	},
	...[mapCommand([about, lang, unshorten], false)]
}
