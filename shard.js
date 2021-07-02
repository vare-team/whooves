// require('http').createServer().listen(1500);

const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./whooves.js', { token: process.env.token });

manager.spawn();

manager.on('shardCreate', shard => {
	const now = new Date();
	console.log(
		`${
			('00' + now.getDate()).slice(-2) +
			'.' +
			('00' + (now.getMonth() + 1)).slice(-2) +
			' ' +
			('00' + now.getHours()).slice(-2) +
			':' +
			('00' + now.getMinutes()).slice(-2) +
			':' +
			('00' + now.getSeconds()).slice(-2)
		} | Shard[${shard.id}] | {ShardingManager} : Launched!`
	);
});

// manager.on('message', (shard, message) => {
// 	let messageNow = new Date();
// 	console.log(`${('00' + messageNow.getHours()).slice(-2) + ':' + ('00' + messageNow.getMinutes()).slice(-2) + ':' + ('00' + messageNow.getSeconds()).slice(-2)} | Shard[${shard.id}] : {Info} ${message._result}`);
// });
