const {SlashCommandBuilder} = require('@discordjs/builders');
const {Permissions, MessageEmbed, GuildBan, GuildMemberManager, Guild} = require("discord.js");
const {clientId} = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kkick')
        .setDescription('Expulser un membre')
        .addUserOption(option => option.setName('cible').setDescription('Membre à expulser').setRequired(true))
        .addStringOption(option => option.setName('raison').setDescription('Raison du ban')),


    async execute(interaction) {
        const cible = interaction.options.getUser('cible');
        let raison = interaction.options.getString('raison');

        const embedSuccess = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("✅ - Membre banni")
            .setAuthor({name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL()})
            .addField("Membre : ", cible.tag, true)
            .setTimestamp()
            .setThumbnail("https://i.imgur.com/BH32Wrx.png")
            .setFooter({text: "Ingénieur Kirin Jindosh", iconURL: interaction.client.user.displayAvatarURL()});


        const embedFail = new MessageEmbed()
            .setColor("RED")
            .setTitle("❌ - Échec de la commande")
            .setTimestamp()
            .setAuthor({name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL()})
            .setFooter({text: "Ingénieur Kirin Jindosh", iconURL: interaction.client.user.displayAvatarURL()});

        const embedDM = new MessageEmbed()
            .setColor("YELLOW")
            .setDescription("Vous avez été expulsé du serveur **" + interaction.guild.name + "**")
            .addField("Modérateur :", interaction.user.tag, true)

        if (raison === null) {
            embedSuccess.addField("Raison : ", "Aucune raison\nn'a été fournie", true);
            embedDM.addField("Raison : ", "Aucune raison\nn'a été fournie", true);
        } else {
            embedSuccess.addField("Raison : ", raison, true);
            embedDM.addField("Raison : ", raison, true);
        }

        if (!interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
            embedFail.setDescription("❌ - Vous n'avez pas l'autorisation d'expulser des membres")
            return interaction.reply({embeds: [embedFail]});
        }

        if (clientId === cible.id) {
            embedFail.setDescription("**Je ne peux pas m'expulser moi même °=°**")
            return interaction.reply({embeds: [embedFail]});
        }


        await cible.createDM();
        await cible.send({embeds: [embedDM]});
        await interaction.guild.members.kick(cible,{reason: [raison]});
        interaction.reply({embeds: [embedSuccess]})
    },
};