const { SlashCommandBuilder } = require('@discordjs/builders');
const {MessageEmbed} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kunban')
        .setDescription('Débannir un membre')
        .addStringOption(option => option.setName("id").setDescription("ID à débannir").setRequired(true))
        .addBooleanOption(option => option.setName("prevenir").setDescription("Prevenir du débannissement").setRequired(true)),

    async execute(interaction) {
        const idUser = interaction.options.getString('id');

        let prevenir = interaction.options.getBoolean('prevenir');
        if (prevenir){
            prevenir = 'Oui';
        } else{
            prevenir = 'Non';
        }

        const fetchedLogs = await interaction.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_BAN_ADD',
        });

        const banLog = fetchedLogs.entries.first();
        const banReason = banLog.reason;
        const banDate = banLog.createdAt.toLocaleTimeString('fr-FR');

        const embedUser = new MessageEmbed()
            .setColor("ORANGE")
            .setTitle('Bannissement de ' + await interaction.client.users.fetch(idUser))
            .addField("Banni le :", banDate, true)
            .addField("Raison :", banReason, true);

        const embedUnban = new MessageEmbed()
            .setColor("GREEN")
            .setTitle(await interaction.client.users.fetch(idUser) + "à bien été débanni");

        await interaction.guild.members.unban(idUser);
        await interaction.reply({embeds: [embedUnban]});


    },
};