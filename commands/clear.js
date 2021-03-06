const {SlashCommandBuilder} = require('@discordjs/builders');
const {Permissions, MessageEmbed} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kclear')
        .setDescription('Suppression de messages')
        .addIntegerOption(option => option.setName('amount').setDescription('Nombre de messages à supprimer')),

    async execute(interaction) {

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        const amount = interaction.options.getInteger('amount');
        const embedFail = new MessageEmbed()
            .setColor("RED")
            .setTitle("❌ - Échec de la commande")
            .setTimestamp()
            .setAuthor({name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL()})
            .setFooter({text: "Ingénieur Kirin Jindosh", iconURL: interaction.client.user.displayAvatarURL()});

        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)){
            embedFail.setDescription("❌ - Vous n'avez pas l'autorisation de supprimer des messages")
            await interaction.reply({embeds: [embedFail]});
            await sleep(1500);
            await interaction.channel.bulkDelete(1, true);
            return;
        }

        if (amount <= 1 || amount > 100) {
            return interaction.reply({
                content: 'Le nombres de messages à supprimer doit être inférieur à 99',
                ephemeral: true
            });
        }
        await interaction.channel.bulkDelete(amount, true).catch(error => {
            console.error(error);
            interaction.reply({
                content: 'There was an error trying to prune messages in this channel!',
                ephemeral: true
            });
        });

        await interaction.reply({content: `\`${amount}\` messages ont été supprimés.`});
        await sleep(1500);
        await interaction.channel.bulkDelete(1, true);
    },
    defaultPermission: Permissions.FLAGS.MANAGE_MESSAGES | Permissions.FLAGS.ADMINISTRATOR,
};