const fs = require('fs');
const Discord = require('discord.js');

const config = require('./config.json');
const logger = require('./utils/logger.js');
const parseCommand = require('./utils/parseCommand');
const client = new Discord.Client();

(() => {
    // Load Commands
    client.commands = new Discord.Collection();
    fs.readdir('./commands', (err, files) => {
        if(err) logger.error(err);
        files.forEach((f) => {
            if(!f.toLowerCase().endsWith('.js')) return;
            const command = require(`./commands/${f}`);
            client.commands.set(command.config.name, command);
            console.log(`Loaded command from ${f}`);
        })
    })

    // Load Events
    client.removeAllListeners();
    fs.readdir('./events', (err, files) => {
        if(err) logger.error(err);
        files.forEach((f) => {
            if(!f.toLowerCase().endsWith('.js')) return;
            const event = require(`./events/${f}`);
            client.on(f.split(".")[0], event.bind(null, client));
            delete require.cache[require.resolve(`./events/${f}`)];
            console.log(`Loaded event from ${f}`)
        })
    })

    client.startTime = new Date();
    client.servers = new Discord.Collection();
    client.login(config.tokens.discord);
})();