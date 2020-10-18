const readStream = require('../../utils/readStream.js');
const shttps = require('socks5-https-client');

module.exports.config = {
    name: "describe",
    description: "Describes an abstract topic.",
    format: [],
    privilegeLevel: 0,
    category: "utility"
}

//https://duckduckgo.com/api

module.exports.run = async (message, stdin, stdout) => {
    let args = require('../../utils/parseCommand.js')(message.content);       
    let url = new URL(`https://api.duckduckgo.com/?q=${encodeURIComponent(args._.join(' '))}&format=json`);

    
    shttps.get({
        socksHost: 'localhost',
        socksPort: 9050,
        host: url.host,
        port: url.port||443,
        path: url.pathname+url.search
    }, (r) => {        
        if(r.statusCode == 200) {                                            
            readStream.stream(r).then((data) => {
                if(args.json) {
                    stdout.write("application/json");
                    stdout.end(data);
                    return;
                }
                stdout.write("text/plain");
                data = JSON.parse(data);
                console.log(data);
                
                if(data.Answer) {
                    stdout.end(data.Answer);
                } else if(data.AbstractText) {
                    stdout.end(data.AbstractText);
                } else if(data.RelatedTopics.length > 0) {                                        
                    stdout.end(data.RelatedTopics[0].Text);
                } else {
                    stdout.end("Who knows");
                }
                

            })
            // Fine
        } else {
            console.log(r.statusCode);
            
            stdout.end(r.statusCode);
            
            // Error
        }
    }).end();
    // readStream(stdin).then((data) => {
    //     if(data.length) {            
    //         stdout.end(message.content.replace('-', data));
    //     } else {            
    //         stdout.end(message.content);
    //     }
    // });
}