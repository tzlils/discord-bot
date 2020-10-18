const parseCommand = require('../../utils/parseCommand.js');
const httpRequest = require('../../utils/httpsPromise');
const fs = require('fs');
const fetch = require("node-fetch");
const readStream = require('../../utils/readStream.js');

module.exports.config = {
    name: "shufer",
    description: "Looks up a product on the shufersal websites.",
    format: [],
    privilegeLevel: 0,
    category: "utility"
}

module.exports.run = async (message, stdin, stdout) => {    
    let args = parseCommand(message.content);

    httpRequest({
        method: 'GET',
        host: 'www.shufersal.co.il',
        port: 443,
        path: `/online/he/search?text=${encodeURIComponent(message.content)}`
    }).then(async (res) => {
        let data = (await readStream.stream(res)).toString();
        let matches = data.match(new RegExp("https://res.cloudinary.com/shufersal/image/upload/f_auto,q_auto/v1551800922/prod/product_images/products_large/....._._._(.*)_1.png.*>", (args.all ? "mgu" : "mu")));
        //                        https://res.cloudinary.com/shufersal/image/upload/f_auto,q_auto/v1551800922/prod/product_images/products_large/OMB40_L_P_46214731552_1.png
        
        if(!matches) {
            stdout.write("text/plain");
            stdout.end("No product found"); 
        } else {
            if(args.image) {                
                if(args.all) {
                    stdout.end("--all is disabled with --image as to not spam ");
                    return;
                }

                stdout.write("image/png");
                const l = matches[0].match("(.*\.png)");
                if(!l) return;
                fetch(l[1]).then((data) => {
                    data.buffer().then((buf) => {
                        stdout.end(buf);
                    })
                })
            } else if(args.all) {
                stdout.write("text/plain");
                for (let i = 0; i < matches.length; i++) {
                    const l = matches[i].match("....._._._(.*)_+?");
                    stdout.write(`${l[1]}\n`);                    
                }
                stdout.end();
            } else {
                stdout.write("text/plain");
                const l = matches[0].match("....._._._(.*)_+?");
                stdout.end(`${l[1]}\n`);
            }
        }
        // console.log(data.slice(matches.index).match(`alt="(.*)"`));
    });

    /*
     else if(args.name) {
                const l = matches[1].match(/alt=\"(.*)\"+?/);
                console.log(l);
                stdout.end(l[1]);
            } else {
                const l = matches[0].match("....._._._(.*)_1.png");
                stdout.end(l[1]);
            }
            */

    // console.log(`https://www.shufersal.co.il/online/he/search?text=${(args._.join('+'))}`);
    
    // exec(`./assets/shufer_lookup.sh חומוס`, function(err, out, serr) {
    //     if (err) {
    //         console.log("erro");
            
    //     }

    //     if(out.length < 2) {
    //         stdout.end("Invalid query");
    //     } else {            
    //         stdout.end(out.slice(2));                       
    //     }        
    // });
    // request(`https://www.shufersal.co.il/online/he/search?text=${(args._.join('+'))}`, (err, res, body) => {  
    //     const $ = cheerio.load(body);
    //     let obj = $(".miglog-prod")[0];
    //     console.log(obj.attribs);
        
                      
    //     // let handler = new htmlparser.DomHandler((err, dom) => {
    //     //     console.log(dom[2].children[3].children[7].children[8].children[3].children[5].children[3].children);
    //     // })
    //     // let parser = new htmlparser.Parser(handler);
    //     // parser.write(body);
    //     // parser.done();
    // })

    // https.request({
    //     method: 'GET',
    //     host: 'media.shufersal.co.il',
    //     port: 443,
    //     path: `/product_images/products_360/${args._[0]}/files/360_assets/index/images/${pad(args._[0], 13)}_1.jpg`
    // }, function(r) {
    //     if(r.statusCode == 403) {
    //         stdout.end("Incorrect product ID or product does not have a 360 view.");
    //     } else if(r.statusCode == 200) {
    //         for (let i = 1; i <= 40; i++) {
    //             https.request({
    //                 method: 'GET',
    //                 host: 'media.shufersal.co.il',
    //                 port: 443,
    //                 path: `/product_images/products_360/${args._[0]}/files/360_assets/index/images/${pad(args._[0], 13)}_${i}.jpg`
    //             }, function(r) {  
    //                 const chunks = [];
    //                 r.on('data', (d) => {chunks.push(d)})
    //                 r.on('end', () => {
    //                     let b = Buffer.concat(chunks);
    //                     fs.writeFileSync(`/tmp/${args._[0]}_${i}.jpg`, b);
    //                 })
    //             })
    //         }
    //     } else {
    //         stdout.end(`Unexpected status code: ${r.statusCode}`);
    //     }
    //     console.log(JSON.stringify(r.statusCode));
    // }).end();
}