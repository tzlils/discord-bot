const readStream = require('../utils/readStream.js');

module.exports.config = {
    name: "echo",
    description: "Echoes a string",
    format: [],
    privilegeLevel: 0,
    category: "utility"
}

module.exports.run = async (message, stdin, stdout) => {
    readStream(stdin).then((data) => { 
        if(data.length) {            
            stdout.end(message.content.replace('-', data));
        } else {            
            stdout.end(message.content);
        }
    });
}