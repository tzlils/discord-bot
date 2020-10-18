const readStream = require('../../utils/readStream.js');
const shttps = require('socks5-https-client');
const shttp = require('socks5-http-client');

module.exports.config = {
    name: "curl",
    description: "GETs a host.",
    format: [],
    privilegeLevel: 0,
    category: "stream"
}

module.exports.run = async (message, stdin, stdout) => {
    let args = require('../../utils/parseCommand.js')(message.content);
    let { type, data } = await readStream.stdin(stdin);

    let url;
    if(type == "text/plain") {        
        url = new URL(data.toString());
    } else {
        url = new URL(args._.join(' '));
    }
    
    let c = (url.protocol == "https:" ? shttps : shttp);
    c.get({
        socksHost: 'localhost',
        socksPort: 9050,
        host: url.host,
        port: url.port||443,
        path: url.pathname
    }, async (r) => {
        if(r.statusCode == 200) {                                            
            console.log(r.headers["content-type"]);
                            
            stdout.write(r.headers["content-type"].split(';')[0]);
            r.pipe(stdout);
            // Fine
        } else {
            console.log("code: " + r.statusCode);
            
            stdout.write("text/plain");
            stdout.end(r.statusCode);
            
            // Error
        }
    }).end();   
}