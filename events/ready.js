module.exports = (client) => {
	client.userLib.sc.registerTask({code: 'presence', execute: client.userLib.presenceFunc});
	client.userLib.sc.registerTask({code: 'unCooldown', execute: (times, id) => times.delete(id)});
	client.userLib.sc.registerTask({code: 'unMute', execute: (mutedRole, member, guild) => {if (guild.roles.has(mutedRole)) member.removeRole(mutedRole, 'Снятие мута!');}});

	client.userLib.presenceFunc();
	client.userLib.sendLog(`Whooves is ready!`);
};