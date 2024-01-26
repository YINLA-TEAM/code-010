const { Client, Events, Collection, ActivityType } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();


const client = new Client({ intents: 32767 });
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for(const folder of commandFolders){
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('js'));
    for(const file of commandFiles){
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if('data' in command && 'execute' in command){
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[警告] 這指令 ${filePath} 不完整，必須要有 'data' 以及 'execute'`)
        }
    }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for(const file of eventFiles){
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if(event.once){
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

module.exports = client;
client.login(process.env.TOKEN).then(() => {
    client.user.setActivity(`I'm code-010`, {type: ActivityType.Watching})
})
