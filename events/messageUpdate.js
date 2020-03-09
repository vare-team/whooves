module.exports = (client, oldmsg, newmsg) => {
	if (oldmsg.author.bot || newmsg.author.bot) return;

	if (newmsg.content.endsWith('w.l')) {
		client.commands.get('lang').run(client, newmsg, oldmsg.content.trim().split(/ +/g));
	}

	if (oldmsg.content == newmsg.content) return;

	client.userLib.sendLogChannel("messageUpdate", oldmsg.guild, { user: { tag: oldmsg.author.tag, id: oldmsg.member.id, avatar: oldmsg.member.user.displayAvatarURL() }, oldContent: oldmsg.content ? oldmsg.content : 'Что-то', newContent: newmsg.content ? newmsg.content : 'Что-то', channel: { id: oldmsg.channel.id }});
};