module.exports.config = {
    name: "test",
    description: "Test command",
    format: [],
    privilegeLevel: 0,
    category: "utility"
}

module.exports.run = async (client, message, args, stdin, stdout) => {
    stdout.end(JSON.stringify({data: `Results: \`${JSON.stringify(args._)}\``, type: "text/plain"}));
}