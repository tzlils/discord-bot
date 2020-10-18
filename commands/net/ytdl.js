const readStream = require('../../utils/readStream.js');
const ytdl = require('ytdl-core');

module.exports.config = {
    name: "ytdl",
    description: "Creates a stream from a youtube link.",
    format: [],
    stdoutRequired: true,
    privilegeLevel: 0,
    category: "stream"
}

module.exports.run = async (message, stdin, stdout) => {
    let args = require('../../utils/parseCommand.js')(message.content);
    let { data, type } = await readStream.stdin(stdin);
    if(type != "text/plain") {
        stdout.write("text/plain");
        stdout.end("No text provided");
    }
    stdout.write("audio/mpeg");
    let y = ytdl(data.toString(), { filter: 'audioonly' });
    y.pipe(stdout);
    // stdout.write("text/plain");
    // stdout.end(message.content);
    // readStream(stdin).then((data) => {
    //     if(data.length) {            
    //         stdout.end(message.content.replace('-', data));
    //     } else {            
    //         stdout.end(message.content);
    //     }
    // });
}