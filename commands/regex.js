const Discord = require('discord.js');

module.exports.config = {
    name: "regex",
    description: "Matches a RegEx pattern.",
    format: [
        {name: "text", type: "string"}
    ],
    privilegeLevel: 0,
    category: "utility"
}

module.exports.run = async (client, message, args, stdin, stdout) => {
    stdin.on('data', (data) => {
      let res = match(args._, JSON.parse(data.toString()).data || "the quick brown fox jumped over the lazy dog");
      stdout.end(JSON.stringify({data: res, type: "text/plain"}));
    })
}

let match = (pattern, string) => {
    try {
      return string.replace(RegExp(pattern, 'g'), "[$&]");
    } catch(e) {
      return "Invalid Regex";
    }
  }