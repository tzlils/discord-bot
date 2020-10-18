const parseCommand = require('../../utils/parseCommand.js');
const readStream = require('../../utils/readStream.js');

module.exports.config = {
    name: "grep",
    description: "Matches a RegEx pattern.",
    format: [],
    stdinRequired: true,
    privilegeLevel: 0,
    category: "text"
}

module.exports.run = async (message, stdin, stdout) => {
  let args = parseCommand(message.content);
  let { data, type } = await readStream.stdin(stdin);

  stdout.write("text/plain");

  if(!type) {
    stdout.end("No text provided");
    return;
  } else if(type != "text/plain") {
    stdout.end("No text provided");
    return;
  }


  text = (data ? data.toString() : text);
  let res = match(args._.join(), text, (args.global ? "gm" : "m"));  
  stdout.end(res);
}

let match = (pattern, string, flags) => {
  let m = string.match(RegExp(pattern, flags));;
  if(!m) return "Invalid RegExp"  
  return m.join('');
}