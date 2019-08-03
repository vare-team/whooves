exports.help = {
    name: "agh",
    description: "Перевернуть это чёртов стол!",
    usage: "agh",
    flag: 3,
    cooldown: 5000
};

var stages = { one: "(°-°)\\ ┬─┬", two: "(╯°□°)╯    ]", three: "(╯°□°)╯  ︵  ┻━┻", four: "(°-°)                   ┻━┻" };
exports.run = (client, msg, args, Discord) => {
	msg.delete();
	msg.channel.send(stages.one).then(m => {
		var interval = setInterval(function() {
			if(m.content === stages.one) return m.edit(stages.two);
			if(m.content === stages.two) return m.edit(stages.three);
			if(m.content === stages.three) return m.edit(stages.four);
			if(m.content === stages.four) { clearInterval(interval); return console.info(`interval возможно is cleared`); }
		}, 1000);
	});
};