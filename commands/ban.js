const { SlashCommandBuilder } = require('@discordjs/builders');
const {Permissions, client, MessageEmbed} = require("discord.js");
const { clientId } = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kban')
        .setDescription('Select a member and ban them (but not really).')
        .addUserOption(option => option.setName('cible').setDescription('Membre à bannir').setRequired(true))
        .addStringOption(option => option.setName('raison').setDescription('Raison du ban'))
        .addIntegerOption(option => option.setName('duree').setDescription('Durée du ban en jours')),


    async execute(interaction) {
        const cible = interaction.options.getMember('cible');
        const raison = interaction.options.getString('raison');
        const duree = interaction.options.getInteger('duree');

        if (cible.id === interaction.member.id)
            return interaction.reply({content: "❌ - Vous ne pouvez pas vous bannir vous même"});

        if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS))
            return interaction.reply({content: "❌ - Vous n'avez pas l'autorisation de bannir des membres"});

        if (clientId === cible.id)
            return interaction.reply({content: "❌ - Je ne peux pas me bannir moi même °=°"});

        interaction.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription("✅ - Membre banni")]})

        return interaction.reply({ content: `You wanted to ban: ${cible.tag}`});
    },
};