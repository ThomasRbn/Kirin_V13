const { SlashCommandBuilder } = require('@discordjs/builders');
const {MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kunban')
        .setDescription('Débannir un membre')
        .addStringOption(option => option.setName("id").setDescription("ID à débannir").setRequired(true))
        .addBooleanOption(option => option.setName("prevenir").setDescription("Prevenir du débannissement").setRequired(true)),

    async execute(interaction) {
        try {
            const idUser = interaction.options.getString('id');
            const utili = await interaction.client.users.fetch(idUser);

            let prevenir = interaction.options.getBoolean('prevenir');
            if (prevenir){
                prevenir = 'Oui';
            } else{
                prevenir = 'Non';
            }

            await interaction.guild.bans.fetch(idUser);

            const fetchedLogs = await interaction.guild.fetchAuditLogs({
                limit: 1,
                type: 'MEMBER_BAN_ADD',
            });

            const banLog = fetchedLogs.entries.first();
            const banReason = banLog.reason;
            const banDate = banLog.createdAt;

            const embedUser = new MessageEmbed()
                .setColor("ORANGE")
                .setTitle('Bannissement de ' + await interaction.client.users.fetch(idUser))
                .addField("Banni le :", banDate + "err", true)
                .addField("Raison :", banReason + "err", true);

            const btn = new MessageActionRow()
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

            const embedUnban = new MessageEmbed()
                .setColor("GREEN")
                .setTitle(await interaction.client.users.fetch(idUser) + " à bien été débanni");

            const embedCancel = new MessageEmbed()
                .setColor("ORANGE")
                .setTitle("Débannissement annulé");

            const collector = interaction.channel.createMessageComponentCollector();

            collector.on('collect', async i => {
                if (i.customId === 'oui') {
                    await interaction.guild.members.unban(idUser);
                    return i.reply({embeds: [embedUnban]});
                } else if (i.customId === 'non'){
                    return i.reply({embeds: [embedCancel]});
                }
            });



        } catch(e) { // Si pas de ban
            if(e.code !== 10026) throw e;
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