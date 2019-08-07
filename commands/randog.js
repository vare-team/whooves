exports.help = {
    name: "randog",
    description: "Случайная картинка с собакеным",
    usage: "randog",
    flag: 3,
    cooldown: 5000
};

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
exports.run = (client, msg, args, Discord) => {
	msg.channel.startTyping();
	var req = new XMLHttpRequest();
	req.open('GET','https://api.thedogapi.com/v1/images/search', false);
	req.send();
	var data = JSON.parse(req.responseText)[0];
	var embed = new Discord.RichEmbed()
    .setAuthor("Вот тебе случайный собакен 🐶")
    .setImage(data.url);
    msg.channel.stopTyping();
	return msg.channel.send(embed);
};