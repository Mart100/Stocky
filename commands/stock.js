const request = require('request')
const Discord = require('discord.js')
const database = require('../scripts/database.js')

// IEX
const { IEXClient } = require('iex-api')
const _fetch = require('isomorphic-fetch')

const iex = new IEXClient(_fetch)


let avURL = 'https://www.alphavantage.co/query?'
let apiKey = 'apikey=Y3W76QOX08LU0J1U'

module.exports = async (message) => {

  let args = message.content.toLowerCase().split(' ')
  let symbol = args[1]

  let companyInfo = await getIEXinfo(symbol)
  let AVinfo = await getAlphavantageINFO(symbol)

  // if symbol not found. Search company
  if(AVinfo == 'ERR') {
    let possibleComps = await searchSymbolByCompanyName(args[1])

    if(possibleComps.length == 0) return message.channel.send('**Nothing found :(**')
    let text = `
**Coudnt find symbol!** 
Searching for symbols by name instead... :
Company     -     Symbol    \n
`

    for(let i in possibleComps) {
      let comp = possibleComps[i]
      text += `${comp.name}   -   ${comp.symbol}\n`
    }


    text += '\nUse \`s!stock <symbol>\` to get a companys stock!'

    message.channel.send(text)
    return
  }

  if(args[2] == 'detailed') return subCommands.detailed(message, companyInfo)

  console.log(companyInfo)

  let infoField = `
    Price: \`${AVinfo.currentPrice}\`
    PriceDate \`${AVinfo.currentPriceDate}\`
    CompanyName: \`${companyInfo.companyName}\`
    Sector: \`${companyInfo.sector}\`
    Symbol: \`${companyInfo.symbol}\`

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

function getIEXinfo(symbol) {
  return new Promise((resolve, reject) => {
    iex.stockCompany(symbol).then(company => {
      resolve(company)
    })
  })
}

function getAlphavantageINFO(symbol) {
  return new Promise((resolve, reject) => {
    request(`${avURL}function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&${apiKey}`, async (err, res, body) => {
      // handle errors
      console.log('Error: ', err)

      // parse body
      body = JSON.parse(body)

      if(body["Error Message"]) {
        resolve('ERR')
        return
      }

      // send data
      resolve({
        currentPrice: Object.values(body["Time Series (1min)"])[0]["1. open"],
        currentPriceDate: Object.keys(body["Time Series (1min)"])[0]
      })
    })
  })
}

function searchSymbolByCompanyName(name) {
  return new Promise((resolve, reject) => {
    request(`http://d.yimg.com/aq/autoc?query=${name}&region=IN&lang=en-UK&callback=YAHOO.Finance.SymbolSuggest.ssCallback`, async (err, res, body) => {
      // handle errors
      console.log('Error: ', err)

      body = body.toString()

      // remove unnecasery stuff
      body = body.replace('YAHOO.Finance.SymbolSuggest.ssCallback(', '').replace(');', '')

      // parse body
      body = JSON.parse(body)

      // send data
      resolve(body["ResultSet"]["Result"])
    })
  })
}