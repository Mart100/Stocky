const Discord = require('discord.js')
const database = require('../scripts/database.js')
const stocks = require('../scripts/stocks.js')

module.exports = async (message) => {
  let args = message.content.toLowerCase().split(' ')
  let symbol = args[1].toUpperCase()
  let buyAmount = Number(args[2])
  let stockInfo = await stocks.getStockInfo(symbol, 'unibit')
  let user = await database.getUser(message.author.id)

  // error messages
  if(isNaN(buyAmount)) message.channel.send('please specify a correct amount of money you want to invest in this stock')
  if(stockInfo == undefined) return message.channel.send('Coudnt retreive stock information. Be sure you typed in the right stock')

  if(buyAmount > user.balance) return message.channel.send(`You tried to buy \`${buyAmount}\`$ Of stocks. But you only have \`${user.balance}\``)


  // variables
  console.log(stockInfo)
  let stockAmount = buyAmount / stockInfo.price 
  let buyFee = buyAmount * 0.005
  let mystocks = user.stocks
  let currentStockAmount = 0
  let oldStockSpend = 0

  // if user already has stock.
  if(mystocks[symbol]) {
    if(mystocks[symbol].spend) oldStockSpend = mystocks[symbol].spend
    if(mystocks[symbol].amount) currentStockAmount = mystocks[symbol].amount
  }
  mystocks[symbol] = {
    amount: stockAmount+currentStockAmount,
    openPrice: stockInfo.price,
    spend: Number(buyAmount)+buyFee+oldStockSpend
  }

  // update database
  database.updateUser(message.author.id, {stocks: mystocks})
  database.updateUser(message.author.id, {balance: user.balance-buyAmount-buyFee})

  let receipt = `
successfully Bought stocks!
__**RECEIPT:**__
    Amount of stocks bought: \`${stockAmount}\`
    StockName: \`${symbol}\`
    Price: \`${buyAmount}\`
    Buy Fee: \`${buyFee}\`
    Current ${symbol} stock price: \`${stockInfo.price}\`

You can find the stocks you own with \`s!mystocks\`!
  `

  message.channel.send(receipt)


}