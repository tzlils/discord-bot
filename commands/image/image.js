const readStream = require('../../utils/readStream.js');
const FileType = require('file-type');
const fetch = require("node-fetch");

module.exports.config = {
    name: "image",
    description: "Echoes an image.",
    format: [],
    privilegeLevel: 0,
    category: "image"
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
    let args = require('../../utils/parseCommand.js')(message.content);
    // let { data, type } = await readStream(stdin);
    let m = message.channel.messages.cache.filter(hasImage).last();            
    if(!m) {
        stdout.write("text/plain");
        stdout.end("No image found");
        return;
    }
    if(m.attachments.size > 0) {
        fetch(m.attachments.entries().next().value[1].url).then((data) => {
            data.buffer().then(async (buf) => {
                stdout.write((await FileType.fromBuffer(buf)).mime)
                stdout.end(buf);
            })
        })
    } else if(m.embeds.length > 0) {                
        if(m.embeds[0].type == "image") {
            fetch(m.embeds[0].url).then((data) => {
                data.buffer().then(async (buf) => {
                    stdout.write((await FileType.fromBuffer(buf)).mime)
                    stdout.end(buf);
                })
            })
        } else if(m.embeds[0].type == "gifv") {
            fetch(m.embeds[0].video.url).then((data) => {
                stdout.write("image/gif");
                data.buffer().then((buf) => {
                    stdout.end(buf);
                })
            })
        }
    } else if(/(?:\w+:)?\/\/(\S+)/.test(m.content)) {
        fetch(m.content).then((data) => {
            data.buffer().then(async (buf) => {
                stdout.write((await FileType.fromBuffer(buf)).mime)
                stdout.end(buf);
            })
        })
    } else {
        stdout.write("text/plain");
        stdout.end("No image found");
        // throw Error("No image found");
    }
}