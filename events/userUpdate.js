module.exports = (client, oldU, newU) => {
	if (oldU.bot || newU.bot) return;

	client.userLib.db.update('users', {userId: newU.id, tag: newU.tag}, () => {});
};