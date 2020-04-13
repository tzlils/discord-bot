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
        const cmd = pipes[i].trim();
        let s = cmd.split(' ');
        
        let commandHandler = client.commands.get(s[0].toLowerCase());
        if(!commandHandler) {
            buffer = null;
            continue;
        }
        // let args = parseCommand(cmd, commandHandler.config.format);

        let stdin = new stream.PassThrough();
        let stdout = new stream.PassThrough();
        if(i > 0) {
            buffer.pipe(stdin);
            buffer.on('end', ()=>{ 
                stdin.end();
            });
        } else {
            stdin.end();
        }
        buffer = stdout;
        
        message.content = cmd.split(' ').slice(1);
        
        commandHandler.run(message, stdin, stdout).catch((reason) => {
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
        let type = await FileType.fromBuffer(chunk);
            
        if(!type) type = {mime: "text/plain"};
        switch (type.mime) {
            case "image/png":
                message.channel.send({files: [{ attachment: Buffer.from(chunk), name: 'image.png' }]});
                break;
            
            case "image/jpeg":
                message.channel.send({files: [{ attachment: Buffer.from(chunk), name: 'image.jpg' }]});
                break;
    
            case "text/plain":
                message.channel.send(sanitize(chunk.toString()));
                break;

            default:
                console.log("Unknown format");
                break;
        }

        chunks.push(chunk) 
    })
    buffer.once('end', () => { 
        Buffer.concat(chunks);
    })
    buffer.on('error', (e) => {
        console.log(e);
        
    })
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