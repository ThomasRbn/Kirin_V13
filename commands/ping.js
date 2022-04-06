const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        return interaction.reply('Pong!');
    },
};