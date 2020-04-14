const parseCommand = require('../utils/parseCommand.js');
const readStream = require('../utils/readStream.js');
const fetch = require("node-fetch");

module.exports.config = {
    name: "image",
    description: "Echoes an image, piped into other commands",
    format: [],
    privilegeLevel: 0,
    category: "utility"
}

function hasImage(m) {   
    if(m.embeds.length > 0) {                            
        if(m.embeds[0].type == "image" || m.embeds[0].type == "gifv") {
            return true;
        }
    } else if(m.attachments.size > 0) {  
        return true;                                      
    } else if(/(?:\w+:)?\/\/(\S+)/.test(m.content)) {
        return true;
    }
    return false;
}

module.exports.run = async (message, stdin, stdout) => {    
    let args = parseCommand(message.content);
    readStream(stdin).then((data) => {   
        if(!data.length) {            
            let m = message.channel.messages.cache.filter(hasImage).last();            
            if(!m) {
                stdout.end("No image found");
                return;
            }
            if(m.attachments.size > 0) {
                fetch(m.attachments.entries().next().value[1].url).then((data) => {
                    data.buffer().then((buf) => {
                        stdout.end(buf);
                    })
                })
            } else if(m.embeds.length > 0) {                
                if(m.embeds[0].type == "image") {
                    fetch(m.embeds[0].url).then((data) => {
                        data.buffer().then((buf) => {
                            stdout.end(buf);
                        })
                    })
                } else if(m.embeds[0].type == "gifv") {
                    fetch(m.embeds[0].video.url).then((data) => {
                        data.buffer().then((buf) => {
                            stdout.end(buf);
                        })
                    })
                }
            } else if(/(?:\w+:)?\/\/(\S+)/.test(m.content)) {
                fetch(m.content).then((data) => {
                    data.buffer().then((buf) => {
                        stdout.end(buf);
                    })
                })
            } else {
                stdout.end("No image found");
                // throw Error("No image found");
            }
        }
    })
}