const Discord = require('discord.js')

module.exports = (message) => {
  let users = await database.ref('users').once('value').then((snapshot) => { return snapshot.val() })
  let top10 = []
  for (let userID in users) {
    if(message.client.users.find('id', userID) == undefined) continue
    top10.push([message.client.users.find('id', userID).username, users[userID].coins])
  }
  top10.sort((b, a) => a[1] - b[1])
  let Embed = new Discord.RichEmbed()
    .addField('top 10:', `
1: ${top10[0][0]} with ${top10[0][1]} coins
2: ${top10[1][0]} with ${top10[1][1]} coins
3: ${top10[2][0]} with ${top10[2][1]} coins
4: ${top10[3][0]} with ${top10[3][1]} coins
5: ${top10[4][0]} with ${top10[4][1]} coins
6: ${top10[5][0]} with ${top10[5][1]} coins
7: ${top10[6][0]} with ${top10[6][1]} coins
8: ${top10[7][0]} with ${top10[7][1]} coins
9: ${top10[8][0]} with ${top10[8][1]} coins
10: ${top10[9][0]} with ${top10[9][1]} coins
  `)
    .setColor(' #42BEAD')
  message.channel.send(Embed)
}