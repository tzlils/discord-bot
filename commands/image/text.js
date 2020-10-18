const gm = require("gm").subClass({imageMagick: true});
const readStream = require('../../utils/readStream.js');
const { createCanvas } = require('canvas');
gm.prototype.buffer = require('../../utils/gmBuffer');

module.exports.config = {
    name: "text",
    description: "Renders text.",
    format: [
                {name: "fontcolor", type: "string"},
                {name: "bgcolor", type: "string"},
                {name: "fontsize", type: "int"},
                {name: "density", type: "int"},
                {name: "font", type: "string"},
            ],
    privilegeLevel: 0,
    category: "image"
}

module.exports.run = async (message, stdin, stdout) => { 
    let args = require('../../utils/parseCommand.js')(message.content);    

    let { data, type } = await readStream.stdin(stdin);
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

    const canvas = createCanvas(600, 200);
    const ctx = canvas.getContext('2d');

    ctx.font = `${args.fontsize||30}px ${args.font||"Arial"}`
    ctx.textAlign = "start";
    wrapText(ctx, text, 0, (parseInt(args.fontsize)||30), 600, (parseInt(args.fontsize)||30));
    // ctx.fillText(args._.join(' '), canvas.width/2, canvas.height/2)

    stdout.write("image/png");
    stdout.end(canvas.toBuffer());

            
    // gm().background(args.bgcolor||"none").fill(args.fontcolor||"black")
    // .font(args.font||"Arial").pointSize(args.fontsize||64).density(args.density||96)
    // .out(`pango:${text||"Please provide text"}`).gravity("Center").setFormat("png")
    // .buffer().then((res) => {            
    //     stdout.end(res);
    // });
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';

    for(var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + ' ';
      var metrics = context.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        context.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      }
      else {
        line = testLine;
      }
    }
    context.fillText(line, x, y);
  }