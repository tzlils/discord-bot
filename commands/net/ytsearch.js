const search = require('youtube-search');
const readStream = require('../../utils/readStream.js');
const config = require("../../config.json");

module.exports.config = {
    name: "ytsearch",
    description: "Looks up on youtube.",
    format: [],
    privilegeLevel: 0,
    category: "utility"
}

module.exports.run = async (message, stdin, stdout) => {
    stdout.write("text/plain");
    search(message.content, {
        maxResults: 1,
        key: config.tokens.youtube
    }, (err, res) => {
        if(err) {
            stdout.end(err.message);
        } else {
            stdout.end(res[0].link);
        }
    })
    // stdout.write("text/plain");
    // stdout.end(message.content);
}