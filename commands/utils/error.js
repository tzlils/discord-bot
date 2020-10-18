const readStream = require('../../utils/readStream.js');

module.exports.config = {
    name: "error",
    description: "Echoes a string",
    format: [],
    privilegeLevel: 0,
    category: "utility"
}

module.exports.run = async (message, stdin, stdout) => {
    throw new Error("Dummy error");
    stdout.write("text/plain");
    stdout.end(message.content);
}