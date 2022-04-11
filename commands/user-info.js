const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed, Permissions, MessageActionRow, MessageButton} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kuser-info')
        .setDescription("Affiche des infos sur son profil ou celui d'un autre")
        .addUserOption(option => option.setName('membre').setDescription("Membre dont on veut afficher les infos").setRequired(true)),
    async execute(interaction) {
        const m = interaction.options.getMember('membre');
        const u = interaction.options.getUser('membre');
        const perm = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('primary')
                    .setLabel('Permissions')
                    .setStyle('PRIMARY'),
            );
        const retour = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('perm')
                    .setLabel('Retour')
                    .setStyle('PRIMARY'),
            );

        const embedBase = new MessageEmbed()
            .setAuthor({name: "Informations sur " + u.tag})
            .setColor("PURPLE")
            .setThumbnail(u.displayAvatarURL());
        if (m.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            embedBase.setDescription("__**Est administrateur du serveur**__")
        }
        embedBase.addField("ID : ", m.id)
            .addField("A rejoint le :", m.joinedAt.toLocaleDateString('fr-FR'), true)
            .addField("Crée le :", u.createdAt.toLocaleDateString('fr-FR'), true)
            .addField('\u200B', '\u200B', true);

        const embedPerm = new MessageEmbed()
            .setAuthor({name: "Permissions globales de " + u.tag})
            .setColor("PURPLE")

        if (m.permissions.has(Permissions.FLAGS.KICK_MEMBERS))
            embedPerm.addField("Peut exclure :", "Oui", true);
        else
            embedPerm.addField("Peut exclure : ", "Non", true);

        if (m.permissions.has(Permissions.FLAGS.BAN_MEMBERS))
            embedPerm.addField("Peut bannir :", "Oui", true);
        else
            embedPerm.addField("Peut bannir : ", "Non", true);

        if (m.permissions.has(Permissions.FLAGS.MUTE_MEMBERS))
            embedPerm.addField("Peut rendre muet :", "Oui", true);
        else
            embedPerm.addField("Peut rendre muet : ", "Non", true);

        const collector = interaction.channel.createMessageComponentCollector();

        collector.on('collect', async i => {
            if (i.customId === 'primary') {
                await i.update({ embeds: [embedPerm], components: [retour] });
            } else if (i.customId === 'perm'){
                await i.update({ embeds: [embedBase], components: [perm] })
            }
        });

        return interaction.reply({embeds: [embedBase], components: [perm]});
    },
};