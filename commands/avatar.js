const fetch = require("node-fetch");

module.exports.config = {
    name: "avatar",
    description: "Echoes a users avatar",
    format: [],
    privilegeLevel: 0,
    category: "utility"
}

module.exports.run = async (message, stdin, stdout) => {        
    if(message.mentions.users.size > 0) {        
        let u = message.mentions.users.entries().next().value[1];        
        fetch(u.avatarURL()).then((data) => {
            data.buffer().then((buf) => {
                stdout.end(buf);
            })
        })
    } else {        
        fetch(message.author.avatarURL()).then((data) => {
            data.buffer().then((buf) => {
                stdout.end(buf);
            })
        })
    }
}