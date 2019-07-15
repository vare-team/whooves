
exports.help = {
    name: "agh",
    description: "Перевернуть это чёртов стол!",
    usage: "agh",
    flag: 3,
    cooldown: 5000
}

exports.run = (client, msg, args, Discord) => {

	msg.delete();

	msg.channel.send("(°-°)\\ ┬─┬").then(m => {
		setTimeout(() => {
			m.edit("(╯°□°)╯    ]").then(ms => {
				setTimeout(() => {
					ms.edit("(╯°□°)╯  ︵  ┻━┻").then(msh => {
						setTimeout(() => {
							msh.edit("(°-°)                   ┻━┻");
						}, 500);
					});
				}, 500);
			});
		}, 500);
	});

};