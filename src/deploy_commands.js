const { REST, Routes } = require('discord.js');
require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for(const folder of commandFolders){
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for(const file of commandFiles){
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if('data' in command && 'execute' in command){
            commands.push(command.data.toJSON());
        } else {
            console.log(`[警告] 這指令 ${filePath} 不完整，必須要有 'data' 以及 'execute'`)
        }
    }
}

const rest = new REST().setToken(process.env.TOKEN);
(async() => {
    try{
        console.log(`[通知] 已開始更新 ${commands.length} 個斜線指令`);
        const data = await rest.put(
            Routes.applicationCommands(process.env.clientId),
            { body: commands },
        );
        console.log(`[通知] 已成功載入 ${data.length} 個斜線指令`);
    } catch(error) {
        console.error(error);
    }
})();