const readStream = require('../../utils/readStream.js');

module.exports.config = {
    name: "head",
    description: "Gets the first nth lines of a string.",
    format: [],
    stdinRequired: true,
    privilegeLevel: 0,
    category: "text"
}

module.exports.run = async (message, stdin, stdout) => {
    let args = require('../../utils/parseCommand.js')(message.content);   
    let { data, type } = await readStream.stdin(stdin);

    stdout.write("text/plain");
    let s = data.toString().split('\n');
    stdout.end(s.slice(0, args.n).join('\n'));
}