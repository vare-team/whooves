module.exports = async (client, oldmsg, newmsg) => {
	if (oldmsg.author.bot || newmsg.author.bot) return;

	if (
		newmsg.channel.type !== 'dm' &&
		!client.userLib.checkPerm(-1, { ownerID: newmsg.guild.ownerID, member: newmsg.member })
	) {
		if (
			(await client.userLib.checkSettings(newmsg.guild.id, 'badwords')) &&
			client.userLib.badWords.some(w =>
				newmsg.content
					.toLowerCase()
					.replace(/[^a-zа-яЁё ]/g, '')
					.replace('ё', 'е')
					.trim()
					.split(/ +/g)
					.includes(w)
			)
		) {
			client.userLib.autowarn(newmsg.author, newmsg.guild, newmsg.channel, 'Ненормативная лексика');
			newmsg.delete();
		}
	}

	if (newmsg.content.endsWith('w.l')) {
		client.commands.get('lang').run(client, newmsg, oldmsg.content.trim().split(/ +/g));
	}

	if (oldmsg.content == newmsg.content) return;

	client.userLib.sendLogChannel('messageUpdate', oldmsg.guild, {
		user: { tag: oldmsg.author.tag, id: oldmsg.member.id, avatar: oldmsg.member.user.displayAvatarURL() },
		oldContent: oldmsg.cleanContent ? oldmsg.cleanContent.replace(client.userLib.mentionDetect, '**@**🏓') : 'Что-то',
		newContent: newmsg.cleanContent ? newmsg.cleanContent.replace(client.userLib.mentionDetect, '**@**🏓') : 'Что-то',
		channel: { id: oldmsg.channel.id },
	});
};
