let embed;

exports.help = {
    name: "lb",
    description: "Таблица лидеров по валюте на сервере",
    usage: "lb",
    flag: 3,
    cooldown: 5000
}

exports.run = (client, msg, args, Discord) => {

	function stablem(money, ico) {
		money = money.toString().replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1.')+' '+ico;
		return money;
	};

	client.db.queryValue('SELECT moneyico FROM servers WHERE id = ?', [msg.guild.id], (err, ico) => {
		client.db.query(`SELECT id, coins FROM users WHERE serid = ? ORDER BY coins DESC LIMIT 5`, [msg.guild.id], (err, res) => {
    		let row_money = '';
    		let row_user = '';
    		 embed = new Discord.RichEmbed()
  			.setAuthor(`${msg.guild.name} - Таблица лидеров сервера `, msg.guild.iconURL)
  			.setColor(client.config.colors.inf);
    		res.forEach((item, i=0) => {
                i++;
    			if (client.users.get(item.id) && item.coins != 0) embed.addField(`${i}. ${client.users.get(item.id).tag}`, stablem(item.coins, ico));
    		})
    		msg.channel.send({embed});
		});
	});

};