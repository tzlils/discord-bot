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

function hasImage(message) {   
    return message.attachments.size > 0;
}

module.exports.run = async (message, stdin, stdout) => {    
    let args = parseCommand(message.content);
    readStream(stdin).then((data) => {   
        if(!data.length) {
            const res = message.channel.messages.cache.filter(hasImage).last();            
            let url = res.attachments.entries().next().value[1].attachment
            fetch(url).then((data) => {
                data.buffer().then((buf) => {
                    stdout.end(buf);
                })
            })
        }
    })
}

// for (const msg of messages) {
//     if (msg.embeds.length !== 0) {
//         if(msg.embeds[0].type == "image") {
//             fetch(msg.embeds[0].url).then((res) => {
//                 stdout.end(res.buffer());
//             })
//         }
//     }
// }