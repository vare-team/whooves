const fs = require('fs');

function generateOutputFile(channel, member) {
  const fileName = `/home/pi/Bots/Akin/records/${channel.id}-${member.id}-${Date.now()}.pcm`;
  return fs.createWriteStream(fileName);
}

exports.help = {
    name: "recorder",
    description: "recorder",
    usage: "recorder",
    flag: 0,
    cooldown: 1000
}

exports.run = (client, msg, args, Discord) => {

	switch (args[1]) {
		case 'join':
    		if (!msg.guild) {
    		  return msg.reply('no private service is available in your area at the moment. Please contact a service representative for more details.');
    		}
    		const voiceConnected = msg.member.voiceChannel;
    		//console.log(voiceConnected.id);
    		if (!voiceConnected || voiceConnected.type !== 'voice') {
    		  return msg.reply(`I couldn't find the channel ${channelName}. Can you spell?`);
    		}
   			voiceConnected.join()
   			  .then(conn => {
   			    msg.reply('ready!');
   			    // create our voice receiver
   			    const receiver = conn.createReceiver();

   			    conn.on('speaking', (user, speaking) => {
   			      if (speaking) {
   			        console.log(`I'm listening to ${user}`);
   			        // this creates a 16-bit signed PCM, stereo 48KHz PCM stream.
   			        const audioStream = receiver.createPCMStream(user);
   			        // create an output stream so we can dump our data in a file
   			        const outputStream = generateOutputFile(voiceConnected, user);
   			        // pipe our audio data into the file stream
   			        audioStream.pipe(outputStream);
   			        outputStream.on("data", console.log);
   			        // when the stream ends (the user stopped talking) tell the user
   			        audioStream.on('end', () => {
   			          console.log(`I'm no longer listening to ${user}`);
   			        });
   			      }
   			    });
   			  })
   			  .catch(console.log);
    		break;
    	case 'leave':
    		msg.member.voiceChannel.leave();
    		break;

	}

};