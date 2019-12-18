module.exports = (client, oldmsg, newmsg) => {

	if (newmsg.content.endsWith('w.l')) {
		const args = oldmsg.content.split(/ +/g);
		let embed = new client.userLib.discord.RichEmbed().setColor(client.userLib.colors.suc).setDescription(client.userLib.translate(args.join(' '))).setAuthor(newmsg.author.tag, newmsg.author.avatarURL).setFooter('Исправление раскладки текста');
		newmsg.channel.send(embed);
		newmsg.delete();
	}

	if (oldmsg.author.bot) return;

	client.userLib.sendLogChannel("messageUpdate", oldmsg.guild, { user: { tag: oldmsg.author.tag, id: oldmsg.member.id, avatar: oldmsg.member.user.displayAvatarURL }, oldContent: oldmsg.content ? oldmsg.content : 'Что-то', newContent: newmsg.content ? newmsg.content : 'Что-то', channel: { id: oldmsg.channel.id }});
};