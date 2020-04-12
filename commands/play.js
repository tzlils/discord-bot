const http = require('http');

module.exports.config = {
    name: "play",
    description: "Play music",
    format: [
                {name: "source", type: "string", pos: 1},
            ],
    privilegeLevel: 0,
    category: "utility"
}

module.exports.run = async (client, message, args) => {
    args.query = args._.split(' ').slice(1).join(' ');
    console.log(args);
    
    //http://ai-radio.org/128.opus
    // let loc = "/home/terradice/media/music/Ben Prunty - Ftl_ Faster Than Light - Original Soundtrack/01 - Space Cruise (Title).mp3";
    // console.log(message.member);
    
    const voiceChannel = message.member.voice.channel;
    const connection = await voiceChannel.join();
    const dispatcher = connection.play('http://ai-radio.org/128.opus', {inlineVolume: true});
}