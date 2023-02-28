import { mapCommand } from "../../utils/functions.js";
import ban from "./ban.js";
import clearmsg from "./clearmsg.js";
import correctall from "./correctall.js";
import govoice from "./govoice.js";
import kick from "./kick.js";
import lookup from "./lookup.js";
import settings from "./settings.js";
import unban from "./unban.js";
import unwarn from "./unwarn.js";
import warn from "./warn.js";
import warns from "./warns.js";

export default {
	__category__: {
		name: "Moderation commands"
	},
	...[mapCommand([ban, clearmsg, correctall, govoice, kick, settings, unban, unwarn, warn, warns], false)],
	...[mapCommand([lookup], true)]
}
