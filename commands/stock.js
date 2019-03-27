const Discord = require('discord.js')
const database = require('../scripts/database.js')
const stocks = require('../scripts/stocks.js')

module.exports = async (message) => {

  let args = message.content.toLowerCase().split(' ')
  let symbol = args[1]

  let companyInfo = await stocks.getIEXinfo(symbol)
  let AVinfo = await stocks.getAlphavantageCurrentINFO(symbol)

  // if symbol not found. Search company
  if(AVinfo == 'ERR') {
    let possibleComps = await stocks.searchSymbolByCompanyName(args[1])

    if(possibleComps.length == 0) return message.channel.send('**Nothing found :(**')
    let text = `
**Coudnt find symbol!** 
Searching for symbols by name instead... :
Company     -     Symbol    \n
`

    for(let i in possibleComps) {
      let comp = possibleComps[i]
      text += `${comp["2. name"]}   -   ${comp["1. symbol"]}\n`
    }


    text += '\nUse \`s!stock <symbol>\` to get a companys stock!'

    message.channel.send(text)
    return
  }

  if(args[2] == 'detailed') return subCommands.detailed(message, companyInfo)


  let infoField = `
    Price: **${AVinfo.price}**
    Volume: **${AVinfo.volume}**
    Change: **${AVinfo.change_percent}**
    CompanyName: **${companyInfo.companyName}**
    Sector: **${companyInfo.sector}**
    Symbol: **${companyInfo.symbol}**

    \`s!stock ${symbol} detailed\` for more detailed company info!

  `

  // return embed
  let Embed = new Discord.RichEmbed()
    .setAuthor('Stocky', 'https://i.imgur.com/dCYvK7M.png')
    .addField(`INFO:`, infoField)
    .setColor('#42BEAD')
  message.channel.send(Embed)

}

subCommands = {
  detailed(message, companyInfo) {
    let text = `__**Detailed info about ${companyInfo.symbol}:**__\n\n`

    for(let key in companyInfo) {
      let value = companyInfo[key]

      text += `**${key}:** \`${value}\` \n`
    }


    message.channel.send(text)
  }
}