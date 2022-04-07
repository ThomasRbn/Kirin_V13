const {SlashCommandBuilder} = require('@discordjs/builders');
const {Permissions, MessageEmbed} = require("discord.js");
const {clientId} = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kban')
        .setDescription('Select a member and ban them (but not really).')
        .addUserOption(option => option.setName('cible').setDescription('Membre à bannir').setRequired(true))
        .addStringOption(option => option.setName('raison').setDescription('Raison du ban')),


    async execute(interaction) {
        const cible = interaction.options.getUser('cible');
        const raison = interaction.options.getString('raison');

        if (cible.id === interaction.member.id)
            return interaction.reply({content: "❌ - Vous ne pouvez pas vous bannir vous même"});

        if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS))
            return interaction.reply({content: "❌ - Vous n'avez pas l'autorisation de bannir des membres"});

        if (clientId === cible.id)
            return interaction.reply({content: "❌ - Je ne peux pas me bannir moi même °=°"});

        const embedBan = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("✅ - Membre banni")
            .setAuthor({name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL()})
            .addField("Membre : ", cible.tag, true)
            .addField("Raison : ", raison, true);

        interaction.reply({embeds: [embedBan]})
        //await cible.kick({reason: raison});
    },
};