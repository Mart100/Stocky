const Discord = require('discord.js')
const fs = require('fs')
const commandList = JSON.parse(fs.readFileSync('./commandList.json', 'utf8'))
const prefix = 's!'

function onMessage(message) {
  if(message.author.bot) return // No responding to other bots
  if(message.channel.type == 'dm') return // No commands in dm's
  message.content = message.content.toLowerCase()
  if(!message.content.startsWith(prefix)) return // Has to start with prefix
  let commandName = message.content.split(' ')[0].replace(prefix, '') // get command
  let command = commandList[commandName]
  if(command == undefined) return message.channel.send(`Command does not exist, type ${prefix}help for all commands`)
  // if has permission. Run
  if(checkPermissions(message, commandName)) {
    let script = require(`../commands/${commandName}.js`)
    script(message)
  }
}
module.exports = onMessage


function checkPermissions(message, commandName) {
  let command = commandList[commandName]

  if(command.permission == 'all') return true
  if(message.author.id == '235452157166485505') return true
  if(command.permission == '') return false
  
  // check if user has role or higher
  let hasHigherPermission = message.guild.roles.find('name', command.permission).comparePositionTo(message.member.highestRole) > 0
  let hasPermission = message.member.roles.has(message.guild.roles.find('name', command.permission))
  if(hasPermission || hasHigherPermission) return true

  // else no permissions
  message.channel.send(`You dont have permission for that command`)
  return false
}