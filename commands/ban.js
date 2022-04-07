const {SlashCommandBuilder} = require('@discordjs/builders');
const {Permissions, MessageEmbed} = require("discord.js");
const {clientId} = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kban')
        .setDescription('Select a member and ban them (but not really).')
        .addUserOption(option => option.setName('cible').setDescription('Membre à bannir').setRequired(true))
        .addStringOption(option => option.setName('raison').setDescription('Raison du ban'))
        .addIntegerOption(option => option.setName('duree').setDescription('Durée du ban en jours')),


    async execute(interaction) {
        const cible = interaction.options.getUser('cible');
        let raison = interaction.options.getString('raison');
        let duree = interaction.options.getInteger('duree');
        const definitif = "Définitif";

        const embedSuccess = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("✅ - Membre banni")
            .setAuthor({name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL()})
            .addField("Membre : ", cible.tag, true)
            .setThumbnail("https://drive.google.com/file/d/1bAUdMwWZuTet4yN0FfDaw5VlT0uyOI6L/view?usp=sharing");


        const embedFail = new MessageEmbed()
            .setColor("RED")
            .setTitle("❌ - Échec de la commande")
            .setAuthor({name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL()});

        if (duree === null){
            embedSuccess.addField("Durée : ", definitif, true);
        } else {
            embedSuccess.addField("Durée : ", duree + " jours", true);
        }

        if (raison === undefined){
            embedSuccess.addField("Raison : ","Aucune raison n'a été fournie");
        } else {
            embedSuccess.addField("Raison : ", raison);
        }

        if (cible.id === interaction.user.id) {
            embedFail.setDescription("❌ - Vous ne pouvez pas vous bannir vous même")
            return interaction.reply({embeds: embedFail});
        }

        if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            embedFail.setDescription("❌ - Vous n'avez pas l'autorisation de bannir des membres")
            return interaction.reply({embeds: embedFail});

        }

        if (clientId === cible.id) {
            embedFail.setDescription("❌ - Je ne peux pas me bannir moi même °=°")
            return interaction.reply({embeds: embedFail});

        }

        interaction.reply({embeds: [embedSuccess]})
        //await cible.ban({reason: raison, days: duree});
    },
};