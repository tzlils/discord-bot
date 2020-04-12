const gm = require("gm").subClass({
    imageMagick: true
});

module.exports.config = {
    name: "text",
    description: "Render text and upload to channel.",
    format: [
                {name: "fontcolor", type: "string"},
                {name: "bgcolor", type: "string"},
                {name: "fontsize", type: "int"},
                {name: "density", type: "int"},
                {name: "font", type: "string"},
            ],
    privilegeLevel: 0,
    category: "utility"
}

module.exports.run = async (client, message, args, stdin, stdout) => { 
    stdin.on('end', () => {
        console.log("stdin closed");
    })
    // asyncReadStream(stdin).then((data) => {
    //     gm().background(args.bgcolor||"none").fill(args.fontcolor||"black")
    //     .font(args.font||"Arial").pointSize(args.fontsize||64).density(args.density||96)
    //     .out(`pango:${data.toString()||"Please provide text"}`).gravity("Center").setFormat("png")
    //     .buffer().then((res) => {            
    //         stdout.end(JSON.stringify({data: res, type: "image/png"}));
    //     });
    // })   
}

gm.prototype.buffer = function() {
    return new Promise((resolve, reject) => {
      this.stream((err, stdout, stderr) => {
        if (err) { return reject(err) }
        const chunks = []
        stdout.on('data', (chunk) => { chunks.push(chunk) })
        // these are 'once' because they can and do fire multiple times for multiple errors,
        // but this is a promise so you'll have to deal with them one at a time
        stdout.once('end', () => { resolve(Buffer.concat(chunks)) })
        stderr.once('data', (data) => { reject(String(data)) })
      })
    })
}

async function asyncReadStream(stream) {
    return new Promise((resolve, reject) => {
        const chunks = []
        stream.on('data', (chunk) => { chunks.push(chunk) })
          // these are 'once' because they can and do fire multiple times for multiple errors,
          // but this is a promise so you'll have to deal with them one at a time
        stream.once('end', () => { resolve(Buffer.concat(chunks)) })
    })
}