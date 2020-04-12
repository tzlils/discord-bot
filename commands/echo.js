module.exports.config = {
    name: "echo",
    description: "Echoes a string",
    format: [],
    privilegeLevel: 0,
    category: "utility"
}

module.exports.run = async (client, message, args, stdin, stdout) => {
    stdout.end(JSON.stringify({data: args._, type: "text/plain"}));
}