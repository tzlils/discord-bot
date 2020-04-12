module.exports.config = {
    name: "test",
    description: "Test command",
    format: [
                {name: "verbose", type: "bool"},
                {name: "name", type: "string"},
                {name: "firstArg", type: "string", pos: 1}
            ],
    privilegeLevel: 0,
    category: "utility"
}

module.exports.run = (client, message, args) => {
    return {data: `Results: \`${JSON.stringify(args)}\``, type: "text/plain"};
    // message.channel.send(`Results: \`${JSON.stringify(args)}\``);
}