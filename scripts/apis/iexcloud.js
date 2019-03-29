const request = require('request')
const _ = require('lodash')

const iex = require('iexcloud_api_wrapper')

let api_url = 'https://cloud.iexapis.com/'
let apiKey = 'sk_74a305e3fbb9402190ffba1984e9cbfe'



module.exports = {
  getCompanyLogo(symbol) {
    return new Promise(async (resolve, reject) => {
      let logo
      try {
        logo = await iex.logoURL(symbol)
      } catch(e) {
        resolve()
        return
      }
      resolve(logo.url)
    })
  },
  getStockInfo(symbol) {
    return new Promise(async (resolve, reject) => {
      let quote
      try {
        quote = await iex.quote(symbol)
      } catch(e) {
        resolve()
        return
      }

      quote.price = quote.latestPrice

      resolve(quote)
    })
  }
}
