const { Client, Message, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const enable = require('../../config/booleans.json')
const config = require('../../config/config.json')
const mensajes = require('../../config/messages.json');
const ticketSchema = require("../../models/ticketSchema");

module.exports = {
  name: "delete",
  aliases: ["borrar"],
  category: ["tickets"],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if(enable.COMMANDS.DELETE === false) return;
    const guildData = await ticketSchema.findOne({guildID: message.guild.id})
    if(!guildData.roles || !guildData.roles.staffRole) return message.channel.send({content: mensajes["NO-ROLES-CONFIG"]}).then((msg) => setTimeout(() => {message.delete(), msg.delete()}, 5000));
    if(!message.member.roles.cache.get(guildData.roles.staffRole) && !message.member.roles.cache.get(guildData.roles.adminRole)) return message.reply({content: `${mensajes['NO-PERMS']}`}).then((msg) => setTimeout(() => {message.delete(), msg.delete()}, 5000));

    if(!guildData) return message.channel.send({content: mensajes['NO-SERVER-FIND']}).then((msg) =>
    setTimeout(() => {msg.delete() }, 5000));
    if(!guildData.tickets || guildData.tickets.length === 0) return message.channel.send({content: mensajes['NO-TICKET-FIND']}).then((msg) =>
    setTimeout(() => {msg.delete()}, 5000));
    const ticketData = guildData.tickets.map(z  => { return { customID: z.customID, ticketName: z.ticketName, ticketFooter: z.ticketFooter, ticketCategory: z.ticketCategory, ticketEmoji: z.ticketEmoji,}})
    const categoryID = ticketData.map(x => {return x.ticketCategory})
    if(!categoryID.includes(message.channel.parentId)) return message.channel.send({content: mensajes['NO-TICKET']}).then((msg) =>
    setTimeout(() => {msg.delete()}, 5000));

    const row = new MessageActionRow().addComponents(
        new MessageButton()
            .setEmoji('👍')
            .setStyle("SUCCESS")
            .setCustomId("DELETE-TICKET-N"),
        new MessageButton()
            .setEmoji("👎")
            .setStyle("DANGER")
            .setCustomId("CANCEL-TICKET-N"),
    )
    const embed = new MessageEmbed()
        .setDescription("```Para cerrar el ticket confirme!```")
        .setColor("DARK_RED")
    message.channel.send({
        embeds: [embed],
        components: [row]
    })
  },
};