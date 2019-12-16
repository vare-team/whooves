exports.help = {
	name: "agh",
	description: "Перевернуть это чёртов стол!",
	usage: "",
	tier: 0,
	cooldown: 5000
};

const stages = [
	"(°-°)\\ ┬─┬",
	"(╯°□°)╯    ]",
	"(╯°□°)╯  ︵  ┻━┻",
	"(°-°)                   ┻━┻"
];

exports.run = (client, msg, args) => {
	msg.delete();
	let mess = msg.channel.send(stages[0]);
	let value = 0;
	let interval = setInterval(() => {
		mess.edit(stages[value]);
		if (value == 3) { clearInterval(interval); }
		value++;
	}, 1000);
};