const config = require('../config.json');
module.exports = (client) => {    
    console.log(`Bots is operating in ${client.guilds.cache.size} guilds`);
    client.user.setActivity(`${config.prefix}help | Terradice#9125`);
}