const stream = require('stream');
const config = require('../config.json');
const client = require('../utils/client');
const logger = require('../utils/logger');

module.exports = async (message) => {
    let f = message.mentions.users.first();
    if(f) {
        if(f.id == client.user.id) message.reply("Please use ~help");
    }
    if (message.author.bot) return;
    if(!message.content.startsWith(config.prefix)) return;
    let pipes = message.content.slice(config.prefix.length).split('|');
    let buffer;

    let time = process.hrtime();
    
    for (let i = 0; i < pipes.length; i++) {
        let cmd = pipes[i].trim();
        let s = cmd.split(' ');
        
        let commandHandler = client.commands.get(s[0].toLowerCase());
        if(!commandHandler) {
            buffer = null;
            break;
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
        if(i == 0 && commandHandler.config.stdinRequired) {
            stdout.write("text/plain");
            stdout.end(`\`${commandHandler.config.name}\` is meant to be piped into from other commands.`);
            break;
        } 
        
        if(commandHandler.config.cooldown != null) {
            let g = client.servers.get(message.guild.id);
            if(!g) {
                client.servers.set(message.guild.id, {});
                g = client.servers.get(message.guild.id);
                g.cooldown = {};
            }
            if(g.cooldown[commandHandler.config.name]) {
                stdout.write("text/plain");
                stdout.end(`${commandHandler.config.name} is on cooldown`);
            } else {
                g.cooldown[commandHandler.config.name] = true;
                setTimeout(() => {
                    g.cooldown[commandHandler.config.name] = false;
                }, commandHandler.config.cooldown)

                // message.channel.startTyping();
                commandHandler.run({
                    channel:    message.channel,
                    member:     message.member,
                    author:     message.author,
                    mentions:   message.mentions,
                    guild:      { id: message.guild.id },
                    content:    s.slice(1).join(' ')
                }, stdin, stdout).catch((reason) => {
                    stdout.end(`\`${commandHandler.config.name}\` has encountered an error`);
                    logger.error(`Error at command ${commandHandler.config.name}, reason: ${reason}`);
                });
            } 
        } else {
            // message.channel.startTyping();
            commandHandler.run({
                channel:    message.channel,
                member:     message.member,
                author:     message.author,
                mentions:   message.mentions,
                guild:      { id: (message.guild ? message.guild.id : null) },
                content:    s.slice(1).join(' ')
            }, stdin, stdout).catch((reason) => {
                stdout.end(`\`${commandHandler.config.name}\` has encountered an error`);
                logger.error(`Error at command ${commandHandler.config.name}, reason: ${reason}`);
            });
        }
    }    

    // message.channel.stopTyping();
    
    if(!buffer) {
        logger.error("Unknown command");
        return;
    };

    let elapsed = process.hrtime(time)[1] / 1000000;
    
    buffer.once('data', (type) => {
        type = type.toString();
        if(type == "text/plain") {
            buffer.on('data', (data) => {
                if(data.length > 2000) {                        
                    message.channel.send("Output is larger than Discord's character limit");
                } else {
                    message.channel.send(sanitize(data.toString()));
                }
            });

            buffer.on('end', () => {
                logger.info(process.hrtime(time)[0] + " s, " + elapsed.toFixed(3) + " ms");
            });
        } else {
            let chunks = [];
            buffer.on('data', chunk => {chunks.push(chunk);});
            buffer.on('end', () => {
                logger.info(process.hrtime(time)[0] + " s, " + elapsed.toFixed(3) + " ms");

                let data = Buffer.concat(chunks);
                switch(type) {
                    case "text/embed":                        
                        message.channel.send(JSON.parse(data.toString()));
                        break;
                    
                    case "image/png":
                        message.channel.send({files: [{ attachment: data, name: 'image.png' }]});
                        break;
            
                    case "image/jpeg":
                        message.channel.send({files: [{ attachment: data, name: 'image.jpg' }]});
                        break;
            
                    case "image/gif":
                        message.channel.send({files: [{ attachment: data, name: 'image.gif' }]});
                        break;      
                        
                    default:
                        message.channel.send("Unknown type: " + type);
                        break;
                }
            })
        }
    })
    // let { data, type} = await readStream.stdin(buffer);
    
    // const chunks = []
    // buffer.on('data', async (chunk) => {
    //     chunks.push(chunk) 
    // })
    // buffer.once('end', () => { 
    //     console.timeEnd("command");
    //     let chunk = Buffer.concat(chunks);
    //     FileType.fromBuffer(chunk).then((type) => {
    //         // console.log(type);
            
    //         // if(!type) type = {mime: "text/plain"}; 
    //         if(!type) {
    //             message.channel.send(JSON.parse(chunk.toString()));
    //             return;
    //         }                       
    //         switch (type.mime) {
    //             case "image/png":
    //                 message.channel.send({files: [{ attachment: Buffer.from(chunk), name: 'image.png' }]});
    //                 break;
                
    //             case "image/jpeg":
    //                 message.channel.send({files: [{ attachment: Buffer.from(chunk), name: 'image.jpg' }]});
    //                 break;

    //             case "image/webp":
    //                 message.channel.send({files: [{ attachment: Buffer.from(chunk), name: 'image.webp' }]});
    //                 break;

    //             case "image/gif":
    //                 message.channel.send({files: [{ attachment: Buffer.from(chunk), name: 'image.gif' }]});
    //                 break;

    //             case "video/mp4":
    //                 message.channel.send({files: [{ attachment: Buffer.from(chunk), name: 'image.mp4' }]});
    //                 break;
    
    //             case "text/plain":
    //                 if(chunk.toString().length > 2000) {                        
    //                     message.channel.send("Output is larger than Discord's character limit");
    //                 } else {
    //                     message.channel.send(sanitize(chunk.toString()));
    //                 }
    //                 break;
    
    //             default:
    //                 console.log("Unknown format: ");
    //                 console.log(type);
                    
    //                 break;
    //         }
    //     });
    // })
    // buffer.on('error', (e) => {
    //     console.log(e);
        
    // })
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