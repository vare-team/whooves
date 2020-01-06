module.exports = (client) => {
	client.userLib.sc.registerTask({code: 'presence', execute: client.userLib.presenceFunc});
	client.userLib.sc.registerTask({code: 'sendSDC', execute: client.userLib.sendSDC});
	client.userLib.sc.registerTask({code: 'unCooldown', execute: (times, id) => times.delete(id)});
	client.userLib.sc.registerTask({code: 'unMute', execute: (mutedRole, member) => {member.removeRole(mutedRole, 'Снятие мута!').catch(() => {});}});

	client.userLib.presenceFunc();
	// client.userLib.sendSDC();

	client.userLib.db.query('SELECT guildId, userId, time, mutedRole FROM mutes LEFT JOIN guilds using(guildId) WHERE time > now()', (err, fields) => {
		for (let field of fields) {
			client.userLib.sc.pushTask({code: 'unMute', params: [field.mutedRole, client.guilds.get(field.guildId).members.get(field.userId)], time: field.time, timeAbsolute: true});
		}
	});

	client.userLib.sendLog(`Shard ready!`, 'ShardingManager');
};