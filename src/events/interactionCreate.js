const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if(!interaction.isChatInputCommand()) return;
        const command = interaction.client.command.get(interaction.commandName);
        if(!command) {
            console.log(`[錯誤] 沒有指令可配對於 ${interaction.commandName}`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
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
        };
    },
};