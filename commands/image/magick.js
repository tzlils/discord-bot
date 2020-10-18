const gm = require("gm").subClass({imageMagick: true});
const readStream = require('../../utils/readStream.js');
gm.prototype.buffer = require('../../utils/gmBuffer');

module.exports.config = {
    name: "magick",
    description: "Distorts an image",
    format: [],
    stdinRequired: true,
    privilegeLevel: 0,
    category: "image"
}

module.exports.run = async (message, stdin, stdout) => {
    let args = require('../../utils/parseCommand.js')(message.content);
    let { data, type } = await readStream.stdin(stdin);
    gm(data)
    .in("(").in("(")
    .coalesce()
    .scale(600, 600).out(")")
    .out("-liquid-rescale", "300x300").out(")")
    .out("-liquid-rescale", "800x800").buffer().then((buf) => {
        stdout.write(type);
        stdout.end(buf);
    })
}