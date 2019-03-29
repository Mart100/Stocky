const Discord = require('discord.js')
const database = require('../scripts/database.js')
const stocks = require('../scripts/stocks.js')

module.exports = async (message) => {

  let args = message.content.toLowerCase().split(' ')
  let symbol = args[1].toUpperCase()

  let companyInfo = await stocks.getCompanyInfo(symbol)
  let stockInfo = await stocks.getStockInfo(symbol)
  let companyLogo = await stocks.getCompanyLogo(symbol)
  console.log(stockInfo)
  let closeTime = new Date(Number(stockInfo.closeTime)).toTimeString().split('(')[0]
  let openTime = new Date(Number(stockInfo.openTime)).toTimeString().split('(')[0]

  // if symbol not found. Search company
  if(stockInfo == undefined) {
    let possibleComps = await stocks.searchSymbolByCompanyName(args[1])
    if(possibleComps == undefined) {
      console.log(possibleComps)
      message.channel.send('This situation should never occur :/')
      return
    }
    if(possibleComps.length == 0) return message.channel.send('**Nothing found :(**')
    let text = `
      **Coudnt find symbol!** 
      Searching for symbols by name instead... :
      Company     -     Symbol    \n
    `

    // add possibleCompanys to text
    for(let i in possibleComps) {
      let comp = possibleComps[i]
      text += `${comp["2. name"]}   -   ${comp["1. symbol"]}\n`
    }


    text += '\nUse \`s!stock <symbol>\` to get a companys stock!'

    message.channel.send(text)
    return
  }
  
  // subcommands
  if(args[2] == 'detailed') return subCommands.detailed(message, companyInfo)
  if(args[2] == 'chart') return subCommands.chart(message)

  companyInfo = companyInfo.data
  let infoField = `
    Price: **${stockInfo.price}**
    Closed: **${stockInfo.closed}**
    Close Time: **${closeTime}**
    Open Time: **${openTime}**
    Change: **${stockInfo.changePercent}%**
    Company Name: **${companyInfo.companyName}**
    Sector: **${companyInfo.sector}**
    Symbol: **${symbol}**

    \`s!stock ${symbol} detailed\` for more detailed company info!

  `

  // return embed
  let Embed = new Discord.RichEmbed()
    .setAuthor('Stocky', 'https://i.imgur.com/dCYvK7M.png')
    .addField(`INFO:`, infoField)
    .setThumbnail(companyLogo)
    .setColor('#42BEAD')
  message.channel.send(Embed)

}

subCommands = {
  detailed(message, companyInfo) {
    let args = message.content.toLowerCase().split(' ')
    let symbol = args[1].toUpperCase()

    let from = companyInfo.from
    companyInfo = companyInfo.data
    let text = `__**Detailed info about ${symbol}:**__\n\n`

    for(let key in companyInfo) {
      let value = companyInfo[key]

      text += `**${key}:** \`${value}\` \n`
    }
    text += `data from: \`${from}\``


    message.channel.send(text)
  },
  async chart(message) {
    let args = message.content.toLowerCase().split(' ')
    let symbol = args[1].toUpperCase()
    let chart = await stocks.getStockChart(symbol, 'day')

    if(chart == 'DATA_UNDEFINED') return message.channel.send('For some reason, Data is undefined. Try again?')

    message.channel.send('test',new Discord.Attachment(chart))
  }
}