const gm = require("gm").subClass({imageMagick: true});
const { promisify } = require("util");
const readStream = require('../utils/readStream.js');
gm.prototype.buffer = require('../utils/gmBuffer');
gm.prototype.sizePromise = promisify(gm.prototype.size);

module.exports.config = {
    name: "caption",
    description: "Echoes a string",
    format: [],
    privilegeLevel: 0,
    category: "utility"
}

module.exports.run = async (message, stdin, stdout) => {
    readStream(stdin).then((data) => { 
        gm(data).sizePromise().then((size) => {   
            gm(data)
            .trim()
            .out("-size", `${size.width}x`)
            .gravity("Center")
            .pointSize(30)
            .out(`caption:${message.content}`)
            .background("white")
            .out("+swap")
            .out("-alpha", "set")
            .out("-set", "page", "%[fx:u.w]x%[fx:u.h+v.h]+%[fx:t?(u.w-v.w)/2:0]+%[fx:t?u.h:0]")
            .coalesce()
            .out("null:").out("-insert", 1).out("-layers", "composite")
            .setFormat("png").buffer().then((buf) => {
                console.log("Processing finished");                
                stdout.end(buf);
            })
        })
    })
        // if(data.length) {            
        //     stdout.end(message.content.replace('-', data));
        // } else {            
        //     stdout.end(message.content);
        // }

    /*
            gm(data).sizePromise().then((size) => {   
            gm(data, "img.png").gravity("Center").out("-size", `${size.width}x${size.height}`)
            .background("white").out(`pango:${message.content}`)
            .out("+repage").extent(size.width, size.height + (size.width / 10)).coalesce()
            .out("-set", "page", "%[fx:u.w]x%[fx:u.h+v.h]+%[fx:t?(u.w-v.w)/2:0]+%[fx:t?u.h:0]").coalesce()
            .out("null:").out("-insert", 1).out("-layers", "composite")
            .setFormat("png").buffer().then((buf) => {
                stdout.end(buf);
            })
        })
        */
}