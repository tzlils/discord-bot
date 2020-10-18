// const readStream = require('../../utils/readStream.js');
const fs = require('fs');
module.exports.config = {
    name: "topic",
    description: "Prints a random topic",
    format: [],
    privilegeLevel: 0,
    category: "utility"
}

let data = fs.readFileSync(__dirname+"/../../assets/topics.txt").toString().split('\n');

module.exports.run = async (message, stdin, stdout) => {
    stdout.write("text/plain");
    stdout.end(data[Math.floor(Math.random()*data.length)]);
    // readStream(stdin).then((data) => {
    //     if(data.length) {            
    //         stdout.end(message.content.replace('-', data));
    //     } else {            
    //         stdout.end(message.content);
    //     }
    // });
}