const Discord = require('discord.js')
const database = require('../scripts/database.js')

module.exports = async (message) => {
  let userInfo = await database.getUser(message.author.id)
  message.channel.send('<@'+message.author.id+'>, you currently have '+Math.round(userInfo.balance)+'$ in your pocket!')
  
}