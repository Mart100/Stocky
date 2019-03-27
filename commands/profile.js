const Discord = require('discord.js')
const database = require('../scripts/database.js')

module.exports = async (message) => {
  // get user
  let user = await database.getUser(message.author.id)

  // if user undefined. create account
  if(user == undefined) return createAccount(message)

  let statsField = `
  Balance: \`${user.balance}\`
  `


  let p = 's!'
  let Embed = new Discord.RichEmbed()
    .setAuthor('Stocky', 'https://i.imgur.com/dCYvK7M.png')
    .addField(`Stats:`, statsField)
    .setFooter(`Prefix: ${p}`)
    .setColor('#42BEAD')
  message.channel.send(Embed)
}


function createAccount(message) {
  // new database user
  database.newUser(message.author.id)

    let p = 's!'
    let Embed = new Discord.RichEmbed()
    .setAuthor(message.author.username, message.author.avatarURL)
    .setTitle("Created now account!")
    .setFooter(`Prefix: **${p}**`)
    .setColor(' #42BEAD')
  message.channel.send(Embed)
}