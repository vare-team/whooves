import {mapCommand} from "../../utils/functions.js";
import ball from './8ball.js'
import avatar from "./avatar.js";
import color from "./color.js";
import help from "./help.js";
import info from "./info.js";

export default {
	__category__: {
		name: "Other commands"
	},
	...[mapCommand([ball, avatar, color, help, info])]
}
