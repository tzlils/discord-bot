const Discord = require('discord.js');
const parseCommand = require('../utils/parseCommand.js');

module.exports.config = {
    name: "grep",
    description: "Matches a RegEx pattern.",
    format: [],
    privilegeLevel: 0,
    category: "utility"
}

module.exports.run = async (message, stdin, stdout) => {
  let args = parseCommand(message.content);
  stdin.on('data', (data) => {
    let res = match(args._.join(), data.toString() || args.string || "the quick brown fox jumped over the lazy dog");
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