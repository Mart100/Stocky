const Discord = require('discord.js')

module.exports = (message) => {
  let p = 's!'
  let Embed = new Discord.RichEmbed()
    .setAuthor('Stocky', 'https://i.imgur.com/dCYvK7M.png')
    .addField('help',            '  Get this message')
    .addField('coins',           '  See the amount of coins you have')
    .addField('leaderboard',     '  See a top 10 most coins')
    .setFooter(`Prefix: ${p}`)
    .setColor(' #42BEAD')
  message.channel.send(Embed)
}