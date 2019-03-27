module.exports = (message) => {
  let userInfo = await database.ref('users/'+message.author.id).once('value').then((snapshot) => { return snapshot.val() })
  message.channel.send('<@'+message.author.id+'>, you currently have '+userInfo.coins+' coins')
  
}