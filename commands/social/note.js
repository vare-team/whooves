exports.help = {
	name: 'note',
	description: 'Заметки\n``add [text] - добавить\nrm [ID] - удалить``',
	aliases: ['nt'],
	usage: [
		{ type: 'text', opt: 1, name: 'add/rm' },
		{ type: 'text', opt: 1, name: 'ID' },
	],
	dm: 1,
	tier: 0,
	cooldown: 5,
};

exports.run = async (client, msg, args) => {
	let embed = new client.userLib.discord.MessageEmbed()
		.setAuthor('📝 Заметки')
		.setFooter(msg.author.tag, msg.author.displayAvatarURL());

	switch (args[0]) {
		case 'add':
			client.userLib.db.insert('notes', { userId: msg.author.id, note: args.slice(1).join(' ') }, (e, res) => {
				embed.setDescription(`Заметка с ID:**${res}** добавлена!`).setColor(client.userLib.colors.suc);
				msg.channel.send(embed);
			});
			break;
		case 'rm':
			if (!args[1]) {
				client.userLib.retError(msg, 'Укажите ID записи!');
				return;
			}
			client.userLib.db.delete('notes', { noteId: args[1], userId: msg.author.id }, (e, res) => {
				if (!res) {
					client.userLib.retError(msg, 'Тщательно проверив свои записи, я не нашёл заметки с такими данными.');
					return;
				}

				embed.setDescription(`Заметка с ID:**${args[1]}** удалена!`).setColor(client.userLib.colors.suc);
				msg.channel.send(embed);
			});
			break;
		default:
			client.userLib.db.query('SELECT * FROM notes WHERE userId = ?', [msg.author.id], (e, res) => {
				// msg.channel.send('Записульки:\n'+res.reduce((pr, cr) => pr + cr.noteId + '. ' + cr.note + '\n', ''));
				embed.setColor(client.userLib.colors.inf);
				for (let i of res) {
					embed.addField('ID: ' + i.noteId, i.note);
				}
				msg.channel.send(embed);
			});
	}
};
