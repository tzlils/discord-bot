const gm = require("gm").subClass({imageMagick: true});
const parseCommand = require('../utils/parseCommand.js');
const readStream = require('../utils/readStream.js');
gm.prototype.buffer = require('../utils/gmBuffer');

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

module.exports.run = async (message, stdin, stdout) => { 
    let args = parseCommand(message.content);    
    
    readStream(stdin).then((data) => {    
        let text = "";    
        if(data.length) {
            if(args._ != "") {
                text = args._.join(' ').replace('-', data.toString());
            } else {
                text = data.toString();
            }
        } else {
            text = args._.join(' ');
        }
                
        gm().background(args.bgcolor||"none").fill(args.fontcolor||"black")
        .font(args.font||"Arial").pointSize(args.fontsize||64).density(args.density||96)
        .out(`pango:${text||"Please provide text"}`).gravity("Center").setFormat("png")
        .buffer().then((res) => {            
            stdout.end(res);
        });
    })   
}