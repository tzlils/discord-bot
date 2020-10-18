const readStream = require('../../utils/readStream.js');
const { createCanvas, loadImage } = require('canvas');
const sizeOf = require('image-size');

module.exports.config = {
    name: "resize",
    description: "Resizes an image.",
    format: [],
    stdinRequired: true,
    privilegeLevel: 0,
    category: "image"
}

module.exports.run = async (message, stdin, stdout) => {
    let args = require('../../utils/parseCommand.js')(message.content);    
    if((parseInt(args._[0]) * parseInt(args._[1])) > 2073600) {
        stdout.end("Dimensions too large");
        return;
    }

    let { data, type } = await readStream.stdin(stdin);
    let size = sizeOf(data);
    let canvas = createCanvas(size.width, size.height);
    let ctx = canvas.getContext('2d');

    if(type == "image/png") {
        loadImage(data).then((img) => {
            ctx.drawImage(img, 0, 0, args._[0], args._[1]);

            stdout.write("image/png");
            stdout.end(canvas.toBuffer());
        });
    }

    // gm(data).resize(args._[0], args._[1]).filter(args.filter||"point").buffer().then((buf) => {
    //     stdout.end(buf);
    // }).catch((err) => {
    //     console.log(err);
        
    // })
}