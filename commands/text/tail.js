const readStream = require('../../utils/readStream.js');

module.exports.config = {
    name: "tail",
    description: "Gets the last nth lines",
    format: [],
    stdinRequired: true,
    privilegeLevel: 0,
    category: "text"
}

module.exports.run = async (message, stdin, stdout) => {
    let args = require('../../utils/parseCommand.js')(message.content);   
    let { data, type } = await readStream.stdin(stdin);
    let s = data.toString().split('\n');
    stdout.write("text/plain");
    stdout.end(s.slice(args.n).join('\n'));
}