const config = require('../config.json');
const client = require('../utils/client.js');
const logger = require('../utils/logger.js')
const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = () => {        
    logger.info(`ONLINE! in ${client.guilds.cache.size} guilds`);
    // client.user.setActivity(`${config.prefix}help | Terradice#9125`);
    exec("fortune archlinux").then((data) => {        
        client.user.setActivity(data.stdout);
    })
    setInterval(() => {
        exec("fortune archlinux").then((data) => {        
            client.user.setActivity(data.stdout);
        })
    }, 30000);
    client.user.setActivity(`${config.prefix}help | Terradice#9125`);
}