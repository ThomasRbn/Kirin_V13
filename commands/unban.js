const { SlashCommandBuilder } = require('@discordjs/builders');
const {MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kunban')
        .setDescription('Débannir un membre')
        .addStringOption(option => option
            .setName("id")
            .setDescription("ID à débannir")
            .setRequired(true)),


    async execute(interaction) {
        try {
            const idUser = interaction.options.getString('id');
            const utili = await interaction.client.users.fetch(idUser);

            //Recherche du ban si il existe
            await interaction.guild.bans.fetch(idUser);
            const fetchedLogs = await interaction.guild.fetchAuditLogs({
                limit: 1,
                type: 'MEMBER_BAN_ADD',
            });
            const banLog = fetchedLogs.entries.first();
            const banReason = banLog.reason;
            const banDate = banLog.createdAt.toLocaleString('fr-FR');
            const banMod = banLog.executor;

            console.log(interaction.client.member)

            //Création des embeds
            const embedUser = new MessageEmbed()
                .setColor("ORANGE")
                .setTitle('Bannissement de ' + await interaction.client.users.fetch(idUser))
                .addField("Banni le :", banDate, true)
                .addField("Raison :", banReason, true)
                .addField("Banni par :", banMod.tag, true);

            const embedUnban = new MessageEmbed()
                .setColor("GREEN")
                .setTitle((await interaction.client.users.fetch(idUser)).tag + " à bien été débanni");

            const embedCancel = new MessageEmbed()
                .setColor("ORANGE")
                .setTitle("Débannissement annulé");

            //Création boutons
            let btn = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('oui')
                        .setLabel('Confirmer')
                        .setStyle('SUCCESS'),

                    new MessageButton()
                        .setCustomId('non')
                        .setLabel("Annuler")
                        .setStyle("DANGER"),
                );

            await interaction.reply({embeds: [embedUser], components: [btn]});

            //Evenement
            const collector = interaction.channel.createMessageComponentCollector();
            collector.on('collect', async i => {
                if (i.customId === 'oui') {
                    await interaction.deleteReply();
                    await interaction.guild.members.unban(idUser);
                    if (prevenir === 'Oui'){
                        await utili.createDM();
                        await utili.send({embeds: [embedDM]});
                    }
                    return i.reply({embeds: [embedUnban]});
                } else if (i.customId === 'non') {
                    await interaction.deleteReply();
                    return i.reply({embeds: [embedCancel]});
                }
            });


        } catch (e) { // Si pas de ban
            if (e.code !== 10026) throw e;
            const idUser = interaction.options.getString('id');
            const utili = await interaction.client.users.fetch(idUser);

            console.log(utili);
            const embedNull = new MessageEmbed()
                .setTitle(utili.tag + " n'est pas banni de ce serveur")
                .setColor("RED");

            return interaction.reply({embeds: [embedNull]});
        }
    },
};