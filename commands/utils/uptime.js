const readStream = require('../../utils/readStream.js');
const client = require('../../utils/client.js');

module.exports.config = {
    name: "uptime",
    description: "Prints the uptime in nanoseconds.",
    format: [],
    privilegeLevel: 0,
    category: "utility"
}

module.exports.run = async (message, stdin, stdout) => {
    let diff = process.hrtime(client.startTime);
    const NS_PER_SEC = 1e9;
    stdout.write("text/plain");
    stdout.end((diff[0] * NS_PER_SEC + diff[1]).toString());
}