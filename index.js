const fs = require('fs');
const Discord = require('discord.js');

const config = require('./config.json');
const logger = require('./utils/logger.js');
const client = require('./utils/client.js');

(() => {
    // Load Commands
    client.commands = new Discord.Collection();
    client.categories = new Discord.Collection();
    fs.readdir('./commands', (err, files) => {
        if(err) logger.error(err);
        console.log(files);
        
        files.forEach((f) => {
            if(!f.toLowerCase().endsWith('.js')) {
                fs.readdir(`./commands/${f}`, (err2, files2) => {
                    if(err2) logger.error(err2);

                    files2.forEach((f2) => {
                        const command = require(`./commands/${f}/${f2}`);
                        load_cmd(command);
                        logger.info(`Loaded command from ${f}/${f2}`);
                    });
                })
            } else {
                const command = require(`./commands/${f}`);
                load_cmd(command);
                logger.info(`Loaded command from ${f}`);
            }
        })
    })

    // Load Events
    client.removeAllListeners();
    fs.readdir('./events', (err, files) => {
        if(err) logger.error(err);
        files.forEach((f) => {
            if(!f.toLowerCase().endsWith('.js')) return;
            const event = require(`./events/${f}`);
            client.on(f.split(".")[0], event.bind(null));
            delete require.cache[require.resolve(`./events/${f}`)];
            logger.info(`Loaded event from ${f}`)
        })
    })

    client.startTime = process.hrtime();
    client.servers = new Discord.Collection();
    client.login(config.tokens.discord);
})();

let load_cmd = (command) => {
    if(!client.categories.has(command.config.category)) {
        client.categories.set(command.config.category, []);
    }
    let a = client.categories.get(command.config.category);    
    a.push(command);

    client.commands.set(command.config.name, command);
}