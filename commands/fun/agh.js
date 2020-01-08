exports.help = {
	name: "agh",
	description: "Перевернуть это чёртов стол!",
	aliases: [],
	usage: "",
	dm: 0,
	tier: 0,
	cooldown: 5
};

const stages = [
	"(°-°)\\ ┬─┬",
	"(╯°□°)╯    ]",
	"(╯°□°)╯  ︵  ┻━┻",
	"(°-°)                   ┻━┻"
];

exports.run = async (client, msg) => {
	msg.delete();
	let mess = await msg.channel.send(stages[0]);
	let value = 1;
	let interval = setInterval(() => {
		mess.edit(stages[value]);
		if (value == 3) { clearInterval(interval); }
		value++;
	}, 1000);
};