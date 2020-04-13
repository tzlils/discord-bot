const parseCommand = require('../utils/parseCommand.js');

module.exports.config = {
    name: "help",
    description: "Test command",
    format: [],
    privilegeLevel: 0,
    category: "utility"
}

module.exports.run = async (message, stdin, stdout) => {
    let args = parseCommand(message.content);
    stdout.end("testing");
}