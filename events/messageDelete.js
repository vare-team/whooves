module.exports = (client, msg) => {
  if (msg.author.bot) return;

	client.userLib.sendLogChannel("messageDelete", msg.guild, { user: { tag: msg.author.tag, id: msg.author.id, avatar: msg.author.displayAvatarURL() }, channel: { id: msg.channel.id }, content: msg.cleanContent ? msg.cleanContent.replace('@here', '**@**here').replace('@everyone', '**@**everypony') : 'Что-то' });
};