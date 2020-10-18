const readStream = require('../../utils/readStream.js');
const { createCanvas, loadImage } = require('canvas');
const sizeOf = require('image-size');

module.exports.config = {
    name: "invert",
    description: "Inverts an image.",
    format: [],
    stdinRequired: true,
    privilegeLevel: 0,
    category: "image"
}

module.exports.run = async (message, stdin, stdout) => {
    let { data, type } = await readStream.stdin(stdin);

    let size = sizeOf(data);
    const canvas = createCanvas(size.width, size.height);
    const ctx = canvas.getContext('2d');  
    if(type == "image/gif") {
        loadImage(data).then((img) => {
            ctx.drawImage(img, 0, 0);
            ctx.globalCompositeOperation = 'difference';
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            stdout.write(type);
            stdout.end(canvas.toBuffer());
        })
    } else {
        loadImage(data).then((img) => {
        
            ctx.drawImage(img, 0, 0);
            ctx.globalCompositeOperation = 'difference';
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
                    
            stdout.write(type);
            stdout.end(canvas.toBuffer());
        })
    }
}