const readStream = require('../../utils/readStream.js');
const awk = require('awk');

module.exports.config = {
    name: "awk",
    description: "Runs awk.",
    format: [],
    privilegeLevel: 0,
    category: "text"
}

module.exports.run = async (message, stdin, stdout) => {    
    let args = require('../../utils/parseCommand.js')(message.content);   
    let { type, data } = await readStream.stdin(stdin);

    stdout.write("text/plain");        
    // Workaround for AWK printing instead of returning result for some reason
    awk(message.content, (data ? data.toString() : ""), stdout);
    stdout.end();
    // console.log(JSON.stringify(child));
    
    

    // child.stdout.on('data', (chunk) => {
    //     console.log(chunk);
        
    //     // data from standard output is here as buffers
    // });

    // child.stdout.on('close', (code) => {
    //     stdout.end("Code: " + code);
    // })
    // stdout.end("a");
    // readStream(stdin).then((data) => {
    //     if(data.length) {            
    //         stdout.end(message.content.replace('-', data));
    //     } else {            
    //         stdout.end(message.content);
    //     }
    // });
}