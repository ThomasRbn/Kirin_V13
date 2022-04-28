const {SlashCommandBuilder} = require('@discordjs/builders');
const {Permissions, MessageEmbed, GuildBan} = require("discord.js");
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
            .setTimestamp()
            .setThumbnail("https://i.imgur.com/O5DJ8qK.png")
            .setFooter({text: "Ingénieur Kirin Jindosh", iconURL: interaction.client.user.displayAvatarURL()});


        const embedFail = new MessageEmbed()
            .setColor("RED")
            .setTitle("❌ - Échec de la commande")
            .setTimestamp()
            .setAuthor({name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL()})
            .setFooter({text: "Ingénieur Kirin Jindosh", iconURL: interaction.client.user.displayAvatarURL()});

        const embedDM = new MessageEmbed()
            .setColor("RED")
            .setDescription("Vous avez été banni du serveur **" + interaction.guild.name + "**")
            .addField("Modérateur :", interaction.user.tag, true);

        if (raison === null) {
            embedSuccess.addField("Raison : ", "Aucune raison n'a été fournie", true);
            embedDM.addField("Raison : ", "Aucune raison n'a été fournie", true);
        } else {
            embedSuccess.addField("Raison : ", raison, true);
            embedDM.addField("Raison : ", raison, true);
        }

        if (duree === null) {
            embedSuccess.addField("Durée : ", definitif, true);
            embedDM.addField("Durée : ", definitif, true);
        } else {
            embedSuccess.addField("Durée : ", duree + " jours", true);
            embedDM.addField("Durée : ", duree + " jours", true);
        }

        if (cible.id === interaction.user.id) {
            embedFail.setDescription("❌ - Vous ne pouvez pas vous bannir vous même")
            return interaction.reply({embeds: [embedFail]});
        }

        if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            embedFail.setDescription("❌ - Vous n'avez pas l'autorisation de bannir des membres")
            return interaction.reply({embeds: [embedFail]});
        }

        if (clientId === cible.id) {
            embedFail.setDescription("**Je ne peux pas me bannir moi même °=°**")
            return interaction.reply({embeds: [embedFail]});
        }

        if (interaction.guild.members.resolve(cible)){
            await cible.createDM();
            await cible.send({embeds: [embedDM]});
        }
        await interaction.guild.members.ban(cible, {reason: [raison], days: [duree]});
        await interaction.reply({embeds: [embedSuccess]})
    },
};