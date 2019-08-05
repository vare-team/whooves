let embed, av;

function isUrl(s) {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return regexp.test(s);
}

module.exports = (client, msg) => {
  if (msg.author.id == client.user.id) return;
  if (msg.author.bot) return;

  if (msg.content == '') msg.content = 'Что-то';
	client.userLib.sendLogChannel("messageDelete", msg.guild, {user: {
		tag: msg.author.tag,
		id: msg.author.id,
    avatar: msg.author.displayAvatarURL,
    content: msg.content,
		channel: msg.channel
	}});
};