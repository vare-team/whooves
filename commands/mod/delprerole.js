exports.help = {
  name: "delprerole",
  description: "Удаляет все роли, созданные интеграцией\n**Роль бота должна быть выше всех!**",
	aliases: ['dpr', 'delpr'],
  usage: [],
	dm: 0,
  tier: -3,
  cooldown: 60,
	hide: 1
};

//дискорд что-то у себя сломал

exports.run = async (client, msg, args) => {

	let count = msg.guild.roles.cache.filter(el => el.managed).size
		, i = 0
		;

	for (let role of msg.guild.roles.cache.filter(el => el.managed).array()) await role.delete('Автогенерируемая роль').then(() => i++).catch();

	if (i != count) {
		client.userLib.retError(msg, 'Недостаточно прав для удаления!');
		return;
	}

	let embed = new client.userLib.discord.setColor(client.userLib.colors.suc).setTitle('Успех!').setDescription('Все роли, созданные интеграциями, были успешно удалены!');
	msg.channel.send(embed);
};