exports.help = {
	name: "notes",
	description: "Записульки",
	aliases: [],
	usage: [{type: 'text', opt: 1, name: ''},
					{type: 'text', opt: 1, name: ''}],
	dm: 1,
	tier: 0,
	cooldown: 5
};

exports.run = async (client, msg, args) => {

	switch (args[0]) {
		case 'add':
			client.userLib.db.insert('notes', {userId: msg.author.id, note: args.slice(1).join(' ')}, (e, res) => {
				msg.reply('Добавлено. ID: '+res);
			});
			break;
		case 'rm':
			client.userLib.db.delete('notes', {noteId: args[1], userId: msg.author.id}, (e, res) => {
				if (!res) {
					client.userLib.retError(msg, 'Тщательно проверив свои записи, я не нашёл записки с такими данными.');
					return;
				}

				msg.reply('Удалено!');
			});
			break;
		default:
			client.userLib.db.query('SELECT * FROM notes WHERE userId = ?', [msg.author.id], (e, res) => {
				msg.channel.send('Записульки:\n'+res.reduce((pr, cr) => pr + cr.noteId + '. ' + cr.note + '\n', ''));
			});
	}

	// let embed = new client.userLib.discord.MessageEmbed().setColor(client.userLib.colors.inf).setTitle('Баланс: ' + coins).setFooter(user.tag, user.displayAvatarURL());
	// msg.channel.send(embed);
};