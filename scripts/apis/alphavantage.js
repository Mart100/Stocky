const request = require('request')
const _ = require('lodash')

let avURL = 'https://www.alphavantage.co/query?'
let apiKey = 'Y3W76QOX08LU0J1U'

module.exports = {
  getStockInfo(symbol) {
    return new Promise((resolve, reject) => {
      request(`${avURL}function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`, async (err, res, body) => {
        // handle errors
        if(err) console.log('Error: ', err)

        // parse body
        body = JSON.parse(body)

        data = body["Global Quote"]

        if(body["Note"] != undefined) return resolve()
        if(_.isEmpty(data)) return resolve()

        // send data
        resolve({
          price: data["05. price"],
          volume: data["06. volume"],
          change: data["09. change"],
          change_percent: data["10. change percent"],
          symbol: data["01. symbol"],

        })
      })
    })
  },

  searchSymbolByCompanyName(name) {
    return new Promise((resolve, reject) => {
      request(`${avURL}function=SYMBOL_SEARCH&keywords=${name}&apikey=${apiKey}`, async (err, res, body) => {
        // handle errors
        if(err) console.log('Error: ', err)

        body = JSON.parse(body)

        // send data
        resolve(body["bestMatches"])
      })
    })
  },
  getStockIntraDay(symbol) {
    return new Promise((resolve, reject) => {
      request(`${avURL}function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${apiKey}`, async (err, res, body) => {
        // handle errors
        if(err) console.log('Error: ', err)

        // parse body
        body = JSON.parse(body)

        data = body["Time Series (5min)"]

        if(_.isEmpty(data)) return resolve('ERR')
          
        resolve(data)
      })
    })
  }
}

 