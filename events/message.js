
const Discord = require('discord.js');
const stream = require('stream');
const config = require('../config.json');
const parseCommand = require('../utils/parseCommand.js');
module.exports = async (client, message) => {
    if (message.author.bot) return;
    if(!message.content.startsWith(config.prefix)) return;
    let pipes = message.content.slice(config.prefix.length).split('|');
    let buffer;
    for (let i = 0; i < pipes.length; i++) {
        const cmd = pipes[i].trim();
        let s = cmd.split(' ');
        
        let commandHandler = client.commands.get(s[0].toLowerCase());
        if(!commandHandler) continue;
        let args = parseCommand(cmd, commandHandler.config.format);

        let stdin = new stream.PassThrough();
        let stdout = new stream.PassThrough();
        if(i > 0) {
            buffer.pipe(stdin);
            buffer.on('end', ()=>{ 
                console.log("first stdout closed");
                stdin.finish();
            });
        }
        buffer = stdout;
        
        console.log(commandHandler.config.name);
        commandHandler.run(client, message, args, stdin, stdout).then((res) => {
            const chunks = []
            stdout.on('data', (chunk) => { chunks.push(chunk) })
            stdout.once('end', () => { 
                Buffer.concat(chunks);
                let data = JSON.parse(Buffer.concat(chunks).toString());
                switch (data.type) {
                    case "image/png":
                        message.channel.send({files: [{ attachment: Buffer.from(data.data.data), name: 'image.png' }]});
                        break;
                    
                    case "image/jpeg":
                        message.channel.send({files: [{ attachment: Buffer.from(data.data.data), name: 'image.jpg' }]});
                        break;
            
                    case "text/plain":
                        message.channel.send(sanitize(data.data));
                        break;
                    default:
                        break;
                }
            })
        })
    }
}

async function asyncReadStream(stream) {
    return new Promise((resolve, reject) => {
    })
}

function sanitize(text) {
    return text.replace('@everyone', '@/everyone').replace('@here', '@/here');
}
                
/*
        try {
            if(!r) continue;
            commandHandler.run(client, message, args).then((res) => {
                buffer = res.stdout;
            })
        } catch(e) {
            var embed = new Discord.MessageEmbed()
            .setColor(Math.floor(Math.random() * (16777216 + 1)))
            .setTitle("Oh no! The bot encountered an unhandled error!")
            .addField('Error message:', e , true)
            .addField('Stacktrace:', `${e.stack.split('\n')[1]}`, true)
            .setFooter("Please report this to Terradice#7561");
            message.channel.send({embed});
        }
*/