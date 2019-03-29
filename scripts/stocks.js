const request = require('request')
const _ = require('lodash')
const charts = require('./charts.js')

// APIS
const unibit = require('./apis/unibit.js')
const iex = require('./apis/iex.js')
const alphavantage = require('./apis/alphavantage.js')
const iexcloud = require('./apis/iexcloud.js')

let avURL = 'https://www.alphavantage.co/query?'
let apiKey = 'apikey=Y3W76QOX08LU0J1U'



module.exports = {
  getCompanyInfo(symbol) {
    return new Promise(async (resolve, reject) => {
      let data 

      data = await unibit.getCompanyInfo(symbol)
      if(data != undefined) return resolve({data: data, from: 'unibit'})
      data = await iex.getCompanyInfo(symbol)
      if(data != undefined) return resolve({data: data, from: 'iex'})

      resolve()
    })
  },
  getCompanyLogo(symbol) {
    return new Promise(async (resolve, reject) => {
      let logo 

      logo = iexcloud.getCompanyLogo(symbol)

      resolve(logo)
    })
  },
  getStockInfo(symbol, api) {
    return new Promise(async (resolve, reject) => {
      let data
      if((api != undefined) == (api == 'iexcloud')) data = await iexcloud.getStockInfo(symbol)
      if(data != undefined) return resolve(data)
      //if((api != undefined) == (api == 'unibit')) data = await unibit.getStockInfo(symbol)
      //if(data != undefined) return resolve(data)
      //if((api != undefined) == (api == 'alphavantage')) data = await alphavantage.getStockInfo(symbol)
      //if(data != undefined) return resolve(data)

      resolve()
    })
  },
  searchSymbolByCompanyName(name) {
    return new Promise((resolve, reject) => {
      request(`${avURL}function=SYMBOL_SEARCH&keywords=${name}&${apiKey}`, async (err, res, body) => {
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
      request(`${avURL}function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&${apiKey}`, async (err, res, body) => {
        // handle errors
        if(err) console.log('Error: ', err)

        // parse body
        body = JSON.parse(body)

        data = body["Time Series (5min)"]

        if(_.isEmpty(data)) return resolve('ERR')
          
        resolve(data)
      })
    })
  },
  // 500x200
  getStockChart(symbol, time) {
    return new Promise(async (resolve, reject) => {

      // get data. and translate it into chart data
      let data = {}
      let currentDate = new Date()
      let chartData = []
      if(time == 'day') {
        data = await this.getStockIntraDay(symbol)
        let newData = []
        for(let dateString in data) {
          let date = new Date(dateString)
          if(date.getTime()+86400000 < currentDate.getTime()) continue

          let openPrice = Number(data[dateString]["1. open"])

          chartData.push({time: date.getTime(), price: openPrice})
        }
      }

      if(chartData.length == 0) return resolve('DATA_UNDEFINED')
      let chart = await charts(chartData)

      resolve(chart)

    })

  }
}

 