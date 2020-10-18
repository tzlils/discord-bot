const gm = require("gm").subClass({imageMagick: true});
const { promisify } = require("util");
const readStream = require('../../utils/readStream.js');
gm.prototype.buffer = require('../../utils/gmBuffer');
gm.prototype.identifyPromise = promisify(gm.prototype.identify);


module.exports.config = {
    name: "speed",
    description: "Speeds up a gif.",
    format: [],
    privilegeLevel: 0,
    category: "image"
}

module.exports.run = async (message, stdin, stdout) => {
    let args = require('../../utils/parseCommand.js')(message.content);
    let { data, type } = await readStream.stdin(stdin);

    gm(data).identifyPromise().then((id) => {
        const delay = id.Delay ? id.Delay[0].split("x") : [0, 100];
        gm(data).delay(delay).setFormat("gif").buffer().then((d) => {
            stdout.write("image/gif");
            stdout.end(d);
        });
    })
}