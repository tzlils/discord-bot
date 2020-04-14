const Discord = require('discord.js');
const parseCommand = require('../utils/parseCommand.js');
const readStream = require('../utils/readStream.js');

module.exports.config = {
    name: "grep",
    description: "Matches a RegEx pattern.",
    format: [],
    privilegeLevel: 0,
    category: "utility"
}

module.exports.run = async (message, stdin, stdout) => {
  let args = parseCommand(message.content);
  readStream(stdin).then((data) => {       
    let text = "the quick brown fox jumped over the lazy dog";
    text = (data.length ? data.toString() : text);
    text = (args.string ? args.string : text);    
    let res = match(args._.join(), text);
    stdout.end(res);
  })
}

let match = (pattern, string) => {
    try {      
      return string.replace(RegExp(pattern, 'g'), "[$&]");
    } catch(e) {
      return "Invalid Regex";
    }
  }