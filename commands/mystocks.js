const Discord = require('discord.js')
const database = require('../scripts/database.js')
const stocks = require('../scripts/stocks.js')

module.exports = async (message) => {

  // variables
  let args = message.content.toLowerCase().split(' ')
  let user = await database.getUser(message.author.id)
  let msg = ''

  // subommands
  if(args[1]) {
    if(args[2] == 'sell') return subcommands.sell(message)
  }

  // loop trough stocks
  for(let stockSymbol in user.stocks) {
    let stock = user.stocks[stockSymbol]
    if(stock.amount == undefined) continue
    let stockInfo = await stocks.getStockInfo(stockSymbol)
    let stockWorth = stockInfo.price*stock.amount

    msg += `
**__${stockSymbol}__**
    amount: \`${stock.amount}\`,
    spend: \`${stock.spend}\`
    worth: \`${stockWorth}\`
    net: \`${stockWorth-stock.spend}\`
`

  }

  message.channel.send(msg)


}

let subcommands = {
  async sell(message) {
    // variables
    let args = message.content.toLowerCase().split(' ')
    let user = await database.getUser(message.author.id)
    let symbol = args[1].toUpperCase()
    let stockInfo = await stocks.getStockInfo(symbol, 'unibit')

    if(stockInfo == undefined) message.channel.send("Can't sell. Stock undefined")


    // some vars
    let stock = user.stocks[symbol]
    //console.log(stock, symbol, user)
    let stockWorth = stockInfo.price*stock.amount
    let mystocks = user.stocks
    mystocks[symbol] = {}

    console.log(user.balance+stockWorth, mystocks)
    database.updateUser(message.author.id, {stocks: mystocks})
    database.updateUser(message.author.id, {balance: user.balance+stockWorth})

    let text = `
Successfully Sold stocks!
__**RECEIPT:**__
    Amount of stocks sold: \`${stock.amount}\`
    StockName: \`${symbol}\`
    Money made: \`${stockWorth-stock.spend}\`
    Sold for: \`${stockWorth}\`
    Spend on stock: \`${stock.spend}\`
    `
    message.channel.send(text)
  }
}