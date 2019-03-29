const Discord = require('discord.js')

module.exports = (message) => {
  let p = 's!'

  let stockCommandsField = `
  **balance** \`see amount of balance you have\`
  **leaderboard** \`See the best stock traders\`
  **stocks** <symbol> \`Get info on stocks\`
  **buy** <symbol> <amount> \`Buy stocks\`
  **mystocks** \`Get the current stocks you have\`
  `
  let Embed = new Discord.RichEmbed()
    .setAuthor('Stocky', 'https://i.imgur.com/dCYvK7M.png')
    .addField('Stock commands:', stockCommandsField)
    .setFooter(`Prefix: ${p}`)
    .setColor(' #42BEAD')
  message.channel.send(Embed)
}