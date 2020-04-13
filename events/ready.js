const config = require('../config.json');
const client = require('../utils/client.js');

module.exports = () => {        
    console.log(`Bots is operating in ${client.guilds.cache.size} guilds`);
    client.user.setActivity(`${config.prefix}help | Terradice#9125`);
}