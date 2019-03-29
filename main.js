const Discord = require('discord.js')
const bot = new Discord.Client()
const env = require('node-env-file')
env(__dirname + '/.env', {raise: false})
const prefix = 's!'

// require scripts
const commands = require('./scripts/commands.js')
const database = require('./scripts/database.js')

// start stuff
database.initialize()

bot.on('ready', async guild => {
  console.log(bot.user.username + ' is ready!')
  try {
    let link = await bot.generateInvite([117824])
    console.log(link)
  } catch (e) {
    console.log(e.stack)
  }

  bot.user.setActivity('s!help')
})

// on message
bot.on('message',  (message) => { commands(message) })


bot.login(process.env["BOT_TOKEN"])
