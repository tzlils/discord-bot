const readStream = require('../../utils/readStream')
const client = require('../../utils/client');

module.exports.config = {
    name: "queue",
    description: "Lists the queue.",
    format: [
                {name: "source", type: "string", pos: 1},
            ],
    privilegeLevel: 0,
    category: "music"
}

module.exports.run = async (message, stdin, stdout) => {
    let args = require('../../utils/parseCommand.js')(message.content);
    //http://ai-radio.org/128.opus
    // let loc = "/home/terradice/media/music/Ben Prunty - Ftl_ Faster Than Light - Original Soundtrack/01 - Space Cruise (Title).mp3";
    // console.log(message.member);

    let guild = client.servers.get(message.guild.id);
    let queue;
    if(!guild) {
        client.servers.set(message.guild.id, { });
        g = client.servers.get(message.guild.id);
        g.queue = [];
        queue = g.queue;
    } else {
        if(!guild.queue) guild.queue = [];
        queue = guild.queue;
    }

    stdout.write("text/plain");
    let songs = [];
    queue.forEach((e) => {
        songs.push(e.data.title || "Unknown Title");
    })
    stdout.end("Queue: " + songs.join(', '));
    
    // stdin.once('data', async (type) => {
    //     console.log(type);
        
    //     const voiceChannel = message.member.voice.channel;
    //     const connection = await voiceChannel.join();

    //     mm.parseStream(stdin, 'audio/mpeg').then(meta => {
    //         console.log(meta);
    //     })

    //     const dispatcher = connection.play(stdin, {
    //         // type: 'ogg/opus'
    //     });  

    //     connection.on('error', (e) => {
    //         console.log("Con" + e);
    //     })
    //     dispatcher.on('finish', () => {
    //         stdout.write("text/plain");
    //         stdout.end("Song is over");
    //         voiceChannel.leave();
    //     })

    //     dispatcher.on('error', (e) => {
    //         console.log("Dis" + e)
    //     })
    // })

}