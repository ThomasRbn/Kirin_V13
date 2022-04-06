const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kbeep')
        .setDescription('Beep!'),
    async execute(interaction) {
        return interaction.reply('Boop!');
    },
};