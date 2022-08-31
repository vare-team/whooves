import filter from './filter.js'
import glitch from './glitch.js'
import petpet from './petpet.js'
import roll from './roll.js'
import {mapCommand} from "../../utils/functions.js";

export default {
	__category__: {
		name: 'Работа с изображениями',
		onlyGuild: false,
	},
	...[mapCommand([filter, glitch, petpet, roll])]
}
