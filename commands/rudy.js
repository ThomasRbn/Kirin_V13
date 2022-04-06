const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('krudy')
        .setDescription('Envoie un message bien sympathique à notre cher Rudy!'),
    async execute(interaction) {
        return interaction.reply("Rudy je t'aime");
    },
};