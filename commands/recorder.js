const fs = require('fs');

function generateOutputFile(channel, member) {
  const fileName = `./records/${channel.id}-${member.id}-${Date.now()}.pcm`;
  return fs.createWriteStream(fileName);
}

exports.help = {
    name: "recorder",
    description: "recorder",
    usage: "recorder",
    flag: 0,
    cooldown: 1000
};

exports.run = (client, msg, args, Discord) => {
	switch (args[0]) {
		case 'join':
    		if (!msg.guild) {
    		  return msg.reply('Вы должны пройти на сервер, для использования данной команды. Вы не можете позвонить боту!');
    		}
    		const voiceConnected = msg.member.voiceChannel;
    		if (!voiceConnected || voiceConnected.type !== 'voice') {
    		  return msg.reply('Для использования данной команды, вы должны пройти в голосовой канал!');
    		}
   			voiceConnected.join()
   			  .then(conn => {
   			    msg.reply('Готов работать!');
   			    const receiver = conn.createReceiver();

   			    conn.on('speaking', (user, speaking) => {
   			      if (speaking) {
   			        console.log(`Я слушаю ${user}`);
   			        const audioStream = receiver.createPCMStream(user);
   			        const outputStream = generateOutputFile(voiceConnected, user);
   			        audioStream.pipe(outputStream);
   			        outputStream.on("data", console.log);
   			        audioStream.on('end', () => {
   			          console.log(`Я больше не слушаю ${user}`);
   			        });
   			      }
   			    });
   			  })
   			  .catch(console.log);
    		break;
    	case 'leave':
    		voiceConnected.leave();
    		break;
	}
};