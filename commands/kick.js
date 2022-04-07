const {SlashCommandBuilder} = require('@discordjs/builders');
const {Permissions, MessageEmbed, GuildBan} = require("discord.js");
const {clientId} = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kkick')
        .setDescription('Select a member and kick them (but not really).')
        .addUserOption(option => option.setName('cible').setDescription('Membre à expulser').setRequired(true))
        .addStringOption(option => option.setName('raison').setDescription('Raison du ban')),


    async execute(interaction) {
        const cible = interaction.options.getMember('cible');
        const raison = interaction.options.getString('raison');

        if (cible.id === interaction.member.id)
            return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setTitle("❌ - Vous ne pouvez pas vous expulser vous même")]});

        if (!interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS))
            return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setTitle("❌ - Vous n'avez pas l'autorisation d'expulser des membres")]});

        if (clientId === cible.id)
            return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setTitle("❌ - Je ne peux pas m'expulser moi même °=°")]});

        await cible.kick({reason: raison});

        interaction.reply({embeds: [new MessageEmbed().setColor("GREEN").setTitle("✅ - Membre expulsé").setDescription("Raison : " + raison)]})
    },
};