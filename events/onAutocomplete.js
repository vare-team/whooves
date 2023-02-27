import {commands} from "../commands/index.js";

export default async function (interaction){
	let cmd = commands[interaction.commandName.toLowerCase()]

	if (!cmd)
		return console.log(interaction.commandName)

	await cmd.autocomplete(Object.values(commands).filter(x => x.help !== undefined), interaction)
}
