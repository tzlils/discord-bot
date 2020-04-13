
module.exports.config = {
    name: "echo",
    description: "Echoes a string",
    format: [],
    privilegeLevel: 0,
    category: "utility"
}

module.exports.run = async (message, stdin, stdout) => {
    stdout.end(message.content.join(' '));
}