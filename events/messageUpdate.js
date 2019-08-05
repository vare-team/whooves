let embed, av;

module.exports = (client, oldmsg, newmsg) => {	
	if (oldmsg.author.bot || !oldmsg.content || !newmsg.content) return;
	if (oldmsg.content == '') oldmsg.content = 'Что-то';
	if (newmsg.content == '') newmsg.content = 'Что-то';
	client.userLib.sendLogChannel("messageUpdate", oldmsg.guild, {user: {
		tag: oldmsg.author.tag,
		id: oldmsg.member.id,
		avatar: oldmsg.member.user.displayAvatarURL,
		oldContent: oldmsg.content,
		newContent: newmsg.content,
		channel: oldmsg.channel
	}});
};