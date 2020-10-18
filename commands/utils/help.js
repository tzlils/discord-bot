const parseCommand = require('../../utils/parseCommand.js');
const client = require('../../utils/client.js');

module.exports.config = {
    name: "help",
    description: "Shows this help message.",
    format: [],
    privilegeLevel: 0,
    category: "utility"
}

module.exports.run = async (message, stdin, stdout) => {
    let args = parseCommand(message.content);
    let f = [];
    let r, g, b;


    if(args._[0]) {
        let c = client.commands.get(args._[0]);
        let seed = xmur3(args._[0]);
        let ran = mulberry32(seed());
        r = ran()*255;        
        g = ran()*255;
        b = ran()*255;
        if(!c) {
            f.push({name: "Could not find command", value: "Did you make a typo?"});
        } else {
            
            f.push({name: c.config.name, value: c.config.description})
        }
    } else {
        let i = 0;    
        for (const cat of client.categories) {            
            let o = {name: cat[0], inline: false};
            let cmds = [];
            cat[1].forEach(cmd => {                
                cmds.push(cmd.config.name);
            })
            o.value = cmds.join(', ');
            f.push(o);
            i++;
        }
    }
    // client.categories.forEach(cat => {
    //     console.log(cat);
        
    //     // let o = {name: cat};
    //     cat.forEach(cmd => {

    //     })
    // });
    let col = r*g*b;
    stdout.write("text/embed");
    stdout.end(JSON.stringify({
        "embed": {
            "color": col,
            "fields": f
        }
    }));
}

function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}
function xmur3(str) {
    for(var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353),
        h = h << 13 | h >>> 19;
    return function() {
        h = Math.imul(h ^ h >>> 16, 2246822507);
        h = Math.imul(h ^ h >>> 13, 3266489909);
        return (h ^= h >>> 16) >>> 0;
    }
}