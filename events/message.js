const Discord = require('discord.js');
const FileType = require('file-type');
const stream = require('stream');
const config = require('../config.json');
const client = require('../utils/client.js');

module.exports = async (message) => {
    if (message.author.bot) return;
    if(!message.content.startsWith(config.prefix)) return;
    let pipes = message.content.slice(config.prefix.length).split('|');
    let buffer;
    message.channel.startTyping();
    for (let i = 0; i < pipes.length; i++) {
        let cmd = pipes[i].trim();
        let s = cmd.split(' ');
        
        let commandHandler = client.commands.get(s[0].toLowerCase());
        if(!commandHandler) {
            buffer = null;
            continue;
        }

        let stdin = new stream.PassThrough();
        let stdout = new stream.PassThrough();
        if(i > 0) {
            buffer.pipe(stdin);
            buffer.on('end', () => { 
                stdin.end();
            });
        } else {
            stdin.end();
        }
        buffer = stdout;        
        
        commandHandler.run({
            channel:    message.channel,
            author:     message.author,
            mentions:   message.mentions,
            content:    s.slice(1).join(' ')
        }, stdin, stdout).catch((reason) => {
            stdout.end(`\`${commandHandler.config.name}\` has encountered an error`);
            console.log(reason);
            
        });
    }    

    message.channel.stopTyping();
    
    if(!buffer) {
        message.channel.send("Unknown command");
        return;
    }


    const chunks = []
    buffer.on('data', async (chunk) => {
        FileType.fromBuffer(chunk).then((type) => {
            if(!type) type = {mime: "text/plain"};            
            switch (type.mime) {
                case "image/png":
                    message.channel.send({files: [{ attachment: Buffer.from(chunk), name: 'image.png' }]});
                    break;
                
                case "image/jpeg":
                    message.channel.send({files: [{ attachment: Buffer.from(chunk), name: 'image.jpg' }]});
                    break;

                case "image/webp":
                    message.channel.send({files: [{ attachment: Buffer.from(chunk), name: 'image.webp' }]});
                    break;

                case "image/gif":
                    message.channel.send({files: [{ attachment: Buffer.from(chunk), name: 'image.gif' }]});
                    break;

                case "video/mp4":
                    message.channel.send({files: [{ attachment: Buffer.from(chunk), name: 'image.mp4' }]});
                    break;
    
                case "text/plain":
                    if(chunk.toString().length > 2000) {                        
                        message.channel.send("Output is larger than Discord's character limit");
                    } else {
                        message.channel.send(sanitize(chunk.toString()));
                    }
                    break;
    
                default:
                    console.log("Unknown format: ");
                    console.log(type);
                    
                    break;
            }
        });

        chunks.push(chunk) 
    })
    buffer.once('end', () => { 
        Buffer.concat(chunks);
    })
    buffer.on('error', (e) => {
        console.log(e);
        
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