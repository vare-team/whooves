module.exports = client => {
	client.userLib.sc.registerTask({ code: 'presence', execute: client.userLib.presenceFunc });
	client.userLib.sc.registerTask({ code: 'sendSDC', execute: client.userLib.sendSDC });
	client.userLib.sc.registerTask({ code: 'unCooldown', execute: (times, id) => times.delete(id) });
	client.userLib.sc.registerTask({
		code: 'unMute',
		execute: (mutedRole, member) => {
			member.roles.remove(mutedRole, 'Снятие мута!').catch(() => {});
		},
	});

	client.userLib.presenceFunc();
	if (process.env.sdc) client.userLib.sendSDC();

	client.userLib.db.query(
		'SELECT guildId, userId, time, mutedRole FROM mutes LEFT JOIN guilds using(guildId) WHERE time > now()',
		(err, fields) => {
			for (let field of fields)
				if (
					client.guilds.cache.get(field.guildId) &&
					client.guilds.cache.get(field.guildId).members.cache.get(field.userId)
				)
					client.userLib.sc.pushTask({
						code: 'unMute',
						params: [field.mutedRole, client.guilds.cache.get(field.guildId).members.cache.get(field.userId)],
						time: field.time,
						timeAbsolute: true,
					});
		}
	);

	client.userLib.sendLog(`Shard ready!`, 'ShardingManager');
	client.userLib.sendWebhookLog("Shard ready!");
};
