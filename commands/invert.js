const gm = require("gm").subClass({imageMagick: true});
const readStream = require('../utils/readStream.js');
gm.prototype.buffer = require('../utils/gmBuffer');

module.exports.config = {
    name: "invert",
    description: "Inverts an image",
    format: [],
    privilegeLevel: 0,
    category: "utility"
}

module.exports.run = async (message, stdin, stdout) => {
    readStream(stdin).then((data) => {      
        gm(data).negative().buffer().then((res) => {            
            stdout.end(res);
        });
    })   
}