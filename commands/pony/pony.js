exports.help = {
	name: 'pony',
	description: 'Поиск по derpibooru.org\n**Для снятие цензуры, команду необходимо использовать в NSFW канале!**',
	aliases: ['derpi', 'ps'],
	usage: [{ type: 'text', opt: 1, name: 'ID' }],
	dm: 1,
	tier: 0,
	cooldown: 5,
	hide: true, // Разобраться с ебучим API Derpibooru
};

exports.run = async (client, msg, args) => {
	let embedErr = new client.userLib.discord.MessageEmbed()
		.setTitle('Derpibooru IMAGE 404')
		.setDescription('По вашему запросу ничего не найдено.')
		.setImage('https://derpicdn.net/img/view/2019/12/29/2233270.gif')
		.setFooter(msg.author.tag, msg.author.displayAvatarURL())
		.setColor(client.userLib.colors.war);

	// let imageId = args[0] && args[0].startsWith('>') ?
	//   args[0].replace(/\D+/g, '') :
	//   (await client.userLib.request({url: `https://derpibooru.org/search.json?random_image=true&filter_id=56027&q=${args.length ? args.join(' ') : '*'}`, json: true})).id;
	// if (!imageId) {msg.channel.send(embedErr);return;}

	let pony = await client.userLib
		.request({ url: `https://derpibooru.org/api/v1/json/images/${args[0].replace(/\D+/g, '')}`, json: true })
		.catch(() => 0);
	if (!pony || pony.image.hidden_from_users) {
		msg.channel.send(embedErr);
		return;
	}
	pony = pony.image;

	let description = pony.tags.reduce((pr, cu) => pr + cu + ',', '**Тэги:** ').slice(0, -1);
	let embed = new client.userLib.discord.MessageEmbed()
		.setTitle(
			`${pony.tags.indexOf('gay') != -1 ? ':rainbow_flag: ' : ''}Derpibooru ${
				pony.format == 'webm' ? 'VIDEO' : 'IMAGE'
			}#${pony.id}`
		)
		.setImage(pony.representations.full)
		.setFooter(msg.author.tag, msg.author.displayAvatarURL())
		.setDescription(description.length <= 2000 ? description : '**Тэги:** слишком много')
		.addField('Оценки', `:star:**${pony.faves}** :thumbsup:**${pony.upvotes}** :thumbsdown:**${pony.downvotes}**`, true)
		.addField('Комментарии', `:pencil:**${pony.comment_count}**`, true)
		.setColor(client.userLib.colors.inf)
		.setURL('https://derpibooru.org/images/' + pony.id);
	if (!msg.channel.nsfw && pony.tags.indexOf('explicit') != -1)
		embed.setImage('https://derpicdn.net/media/2014/01/07/21_08_05_460_rect4.png');
	msg.channel.send(pony.tags.indexOf('futa') != -1 ? '<@264773177815728129>' : '', embed);
};
