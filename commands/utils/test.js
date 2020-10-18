const parseCommand = require('../../utils/parseCommand.js');

module.exports.config = {
    name: "test",
    description: "Test command.",
    format: [],
    privilegeLevel: 0,
    category: "utility"
}

module.exports.run = async (message, stdin, stdout) => {    
    let args = parseCommand(message.content);
    stdout.end(`\`${JSON.stringify(args)}\``);
}