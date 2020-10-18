const readStream = require('../../utils/readStream.js');
const client = require('../../utils/client');
const mm = require('music-metadata');

module.exports.config = {
    name: "play",
    description: "Adds a song to queue.",
    format: [],
    stdinRequired: true,
    privilegeLevel: 0,
    category: "music"
}

module.exports.run = async (message, stdin, stdout) => {
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

    stdout.write('text/plain');
    console.log(queue);
    

    stdin.once('data', async (type) => {
        type = type.toString();
        if(type != "audio/mpeg") {
            stdout.end("Currently not accetpting anything that isnt audio/mpeg, got type: " + type);
            return;
        }          

        if(queue.length <= 0) {
            queue.push({data: {}, stream: stdin});
            stdout.write("Added to queue");

            play(message.member.voice.channel, queue).then(() => {
                stdout.end("Queue is over");
                message.member.voice.channel.leave();
            });
        } else {
            queue.push({data: {}, stream: stdin});
            stdout.end("Added to queue");
        }    
        // mm.parseStream(stdin, type).then(meta => {            
    
        // });
    });
    // readStream(stdin).then((data) => {
    //     if(data.length) {            
    //         stdout.end(message.content.replace('-', data));
    //     } else {            
    //         stdout.end(message.content);
    //     }
    // });
}

function play(channel, queue) {
    return new Promise(async (resolve, reject) => {

        let con = await channel.join();
        // queue[0].stream.on('data', () => {
        //     console.log("Data after write");
        // })        
        // queue[0].stream.resume();
        const dispatcher = con.play(queue[0].stream);
    
        dispatcher.on('finish', () => {
            console.log(queue.length);
            
            queue.shift();
            if(queue.length == 0) {
                resolve();
            } else {
                play(channel, queue);
            }
        })

        dispatcher.on('error', (e) => {
            reject();
        })
    })
}