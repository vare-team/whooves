module.exports = async (client, oldmsg, newmsg) => {
	if (oldmsg.author.bot || newmsg.author.bot) return;

	if (newmsg.channel.type !== 'dm' && await client.userLib.checkSettings(newmsg.guild.id, 'badwords') && client.userLib.badWords.some(w => newmsg.content.toLowerCase().replace(/[^a-zа-яЁё ]/g,'').trim().split(/ +/g).includes(w))) {
		client.userLib.autowarn(newmsg.author, newmsg.guild, newmsg.channel, 'Ненормативная лексика');
		newmsg.delete();
	}

	if (newmsg.content.endsWith('w.l')) {
		client.commands.get('lang').run(client, newmsg, oldmsg.content.trim().split(/ +/g));
	}

	if (oldmsg.content == newmsg.content) return;

	client.userLib.sendLogChannel("messageUpdate", oldmsg.guild, { user: { tag: oldmsg.author.tag, id: oldmsg.member.id, avatar: oldmsg.member.user.displayAvatarURL() }, oldContent: oldmsg.content ? oldmsg.content : 'Что-то', newContent: newmsg.content ? newmsg.content : 'Что-то', channel: { id: oldmsg.channel.id }});
};