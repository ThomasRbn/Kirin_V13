const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed, Permissions} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kuser-info')
        .setDescription("Affiche des infos sur son profil ou celui d'un autre")
        .addUserOption(option => option.setName('membre').setDescription("Membre dont on veut afficher les infos").setRequired(true)),
    async execute(interaction) {
        const m = interaction.options.getMember('membre');
        const u = interaction.options.getUser('membre');
        const embedOK = new MessageEmbed()
            .setAuthor({name: "Informations sur " + u.tag})
            .setColor("PURPLE")
            .setThumbnail(u.displayAvatarURL());

        if (m.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            embedOK.setDescription("__**Est administrateur du serveur**__")
        }

        embedOK.addField("ID : ", m.id)
            .addField("A rejoint le :", m.joinedAt.toLocaleDateString('fr-FR'), true)
            .addField("Crée le :", u.createdAt.toLocaleDateString('fr-FR'), true)
            .addField('\u200B', '\u200B', true)


        if (m.permissions.has(Permissions.FLAGS.KICK_MEMBERS))
            embedOK.addField("Peut exclure :", "Oui", true);
        else
            embedOK.addField("Peut exclure : ", "Non", true);

        if (m.permissions.has(Permissions.FLAGS.BAN_MEMBERS))
            embedOK.addField("Peut bannir :", "Oui", true);
        else
            embedOK.addField("Peut bannir : ", "Non", true);

        if (m.permissions.has(Permissions.FLAGS.MUTE_MEMBERS))
            embedOK.addField("Peut rendre muet :", "Oui", true);
        else
            embedOK.addField("Peut rendre muet : ", "Non", true);


        return interaction.reply({embeds: [embedOK]});
    },
};