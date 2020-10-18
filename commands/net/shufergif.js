const parseCommand = require('../../utils/parseCommand.js');
const { createCanvas, loadImage } = require('canvas');
const GIFEncoder = require('gifencoder');
const sizeOf = require('image-size');
const httpRequest = require('../../utils/httpsPromise');
const readStream = require('../../utils/readStream.js');


module.exports.config = {
    name: "shufergif",
    description: "Generates a gif from a shufersal product id.",
    format: [],
    privilegeLevel: 0,
    cooldown: 10000,
    category: "image"
}

module.exports.run = async (message, stdin, stdout) => {
    let args = parseCommand(message.content); 
    let { data, type } = await readStream.stdin(stdin);
    console.log(data.toString());
    

    if(type != "text/plain" && type) {
        stdout.write("text/plain");
        stdout.end("No text provided");
        return;
    }
    
    findCode(data.toString().trim()).then(async (o) => {        
        let canvas = createCanvas(o.size.width, o.size.height);
        let ctx = canvas.getContext('2d');

        stdout.write("image/gif");
        const encoder = new GIFEncoder(o.size.width, o.size.height);  
        encoder.createReadStream().pipe(stdout); 
        encoder.start();
        encoder.setRepeat(0);   // 0 for repeat, -1 for no-repeat
        encoder.setDelay(100*(1/(args.speed||1)));  // frame delay in ms
        encoder.setQuality(10); // image quality. 10 is default.



        args.frames = parseInt(args.frames);
        if(!args.frames) args.frames = 40; else if(args.frames > 40) args.frames = 40;
        args.fps = parseInt(args.fps); 
        if(!args.fps) {
            args.fps = 1;
        } else if (args.fps < 1) {
            args.fps = 1;
        } else if(args.fps > 40) {
            args.fps = 40;  
        } 

        let frames = [];        
        let f = 0;
        for (let i = 0; i < args.frames; i += args.fps) {
            httpRequest({
                method: 'GET',
                host: 'media.shufersal.co.il',
                port: 443,
                path: `/product_images/products_360/${data.toString().trim() || args._[0]}/files/360_assets/index/images/${o.code}_${i+1}.jpg`
            }).then(async (res) => {
                // console.log(`https://media.shufersal.co.il/product_images/products_360/${args._[0]}/files/360_assets/index/images/${id}_${i+1}.jpg`);
                frames[i/args.fps] = await loadImage((await readStream.stream(res)));
                f++;
                
                
                console.log(`${f}:${Math.floor(args.frames/args.fps)} at ${i}`);
                
                
                if(f == Math.floor(args.frames/args.fps)) {  
                    if(args.reverse) frames = frames.reverse();
                    if(args.random) frames = frames.sort((a, b) => {return 0.5 - Math.random()})
                    frames.forEach(async frame => {         
                        ctx.drawImage(frame, 0, 0);
                        encoder.addFrame(ctx);     
                    });

                    encoder.finish();
                    // stdout.end(encoder.out.getData());
                    // stdout.end(encoder.out.getData());  
                    // let img = gm().out('-resize', '%80').out('-loop', '0').out('-delay', '10');
                    // files.forEach(f => {
                    //     img = img.in(f);
                    // });
                    // img.setFormat("gif").buffer().then((buf) => {
                    //     stdout.end(buf);
                    //     files.forEach(f => {
                    //         fs.unlinkSync(f);
                    //     })
                    // })
                }
            }).catch((e) => {
                console.log(e);
            });
        }
    }).catch((e) => {
        console.log(e);
        stdout.write("text/plain");
        stdout.end(e);
    });
}

function findCode(code) {    
    return new Promise(async (resolve, reject) => {        
        httpRequest({
            method: 'GET',
            host: 'media.shufersal.co.il',
            port: 443,
            path: `/product_images/products_360/${code}/files/360_assets/index/images/${code}_1.jpg`
        }).then((r) => {
            readStream.stream(r).then((data) => {
                let size = sizeOf(data);
                resolve({code, size});
            })
        }).catch((e) => {
            httpRequest({
                method: 'GET',
                host: 'media.shufersal.co.il',
                port: 443,
                path: `/product_images/products_360/${code}/files/360_assets/index/images/${pad(code, 13)}_1.jpg`
            }).then((r) => {
                readStream.stream(r).then((data) => {
                    let size = sizeOf(data);
                    resolve({code: pad(code, 13), size});
                })
            }).catch((e) => {
                reject("Incorrect product ID or product does not have a 360 view.");
            })
        });
        
        /*
        .then(async (res) => {
            if(res.statusCode == 200) {
                size(res.body).then((dim) => {
                    console.log(dim);
                    resolve(code, dim);
                });
            } else {
                reject(`Unknown status code: ${res.statusCode}`);
            }
        }).catch(e => {
            httpRequest({
                method: 'GET',
                host: 'media.shufersal.co.il',
                port: 443,
                path: `/product_images/products_360/${code}/files/360_assets/index/images/${pad(code, 13)}_1.jpg`
            }).then(async (res) => {
                if(res.statusCode == 200) {
                    size(res.body).then((dim) => {
                        console.log(dim);
                        resolve(pad(code, 13), dim);
                    });
                } else {
                    reject(`Unknown status code: ${res.statusCode}`);
                }
            }).catch(e => {
                console.log(e);
                
                reject("Incorrect product ID or product does not have a 360 view.");
            })
        })  
        */
    });
}

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}