const { Client, Events, Collection, ActivityType } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

const client = new Client({ intents: 32767 });
client.commands = new Collection();

client.once(Events.ClientReady, readyClient =>{
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

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

client.on(Events.InteractionCreate, async interaction => {
    if(!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if(!command){
        console.error(`[錯誤] 沒有指令可配對於 ${interaction.commandName}`);
        return;
    }

    try{
        await command.execute(interaction);
    } catch(error) {
        console.error(error);
        if(interaction.replied || interaction.deferred){
            await interaction.followUp({
                content: '在執行此指令時，發生了一個錯誤',
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: '在執行此指令時，發生了一個錯誤',
                ephemeral: true
            })
        }
    }
})

module.exports = client;
client.login(process.env.TOKEN).then(() => {
    client.user.setActivity(`I'm code-010`, {type: ActivityType.Watching})
})
