const request = require('request')
const _ = require('lodash')

// IEX
const { IEXClient } = require('iex-api')
const _fetch = require('isomorphic-fetch')

const iex = new IEXClient(_fetch)


let avURL = 'https://www.alphavantage.co/query?'
let apiKey = 'apikey=Y3W76QOX08LU0J1U'



module.exports = {
  getIEXinfo(symbol) {
    return new Promise((resolve, reject) => {
      iex.stockCompany(symbol).then(company => {
        resolve(company)
      })
    })
  },

  getAlphavantageCurrentINFO(symbol) {
    return new Promise((resolve, reject) => {
      request(`${avURL}function=GLOBAL_QUOTE&symbol=${symbol}&${apiKey}`, async (err, res, body) => {
        // handle errors
        console.log('Error: ', err)

        // parse body
        body = JSON.parse(body)

        data = body["Global Quote"]

        if(_.isEmpty(data)) resolve('ERR')

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
      request(`${avURL}function=SYMBOL_SEARCH&keywords=${name}&${apiKey}`, async (err, res, body) => {
        // handle errors
        console.log('Error: ', err)

        body = JSON.parse(body)

        // send data
        resolve(body["bestMatches"])
      })
    })
  }
}

