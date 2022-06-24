import about from './about.js'
import lang from './lang.js'
// import ticker from './ticker.js'
import unshorten from './unshorten.js'

export default {
	__category__: {
		name: 'Контекстные команды',
		onlyGuild: true,
	},
	'информация': about,
	lang,
	// ticker,
	unshorten
}
