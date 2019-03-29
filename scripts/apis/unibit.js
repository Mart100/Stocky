const request = require('request')
const _ = require('lodash')

let api_url = 'https://api.unibit.ai/'
let apiKey = 'sp8z3-wUMIvuz8APwtD2-OC57YEEi1wA'



module.exports = {
  getCompanyInfo(symbol) {
    return new Promise((resolve, reject) => {
      request(`${api_url}companyprofile/${symbol}?AccessKey=${apiKey}`, async (err, res, body) => {
        body = JSON.parse(body)

        resolve({
          symbol: body.ticker,
          companyName: body.company_name,
          exchange: body.exchange,
          industry: body.industry,
          website: body.website,
          CEO: body.company_leadership,
          description: body.company_decription,
          issueType: body.asset_type,
          sector: body.sector
        })
      })
    })
  },
  getStockIntraDay(symbol, size=100) {
    return new Promise((resolve, reject) => {
      request(`${api_url}realtimestock/${symbol}?size=${size}&AccessKey=${apiKey}`, async (err, res, body) => {
        body = JSON.parse(body)

        resolve(body)
      })
    })
  },
  getStockInfo(symbol) {
    return new Promise((resolve, reject) => {
      request(`${api_url}financials/summary/${symbol}?AccessKey=${apiKey}`, async (err, res, body) => {
        body = JSON.parse(body)
        
        let nowDate = new Date()
        let intraDayCurrent = await this.getStockIntraDay(symbol, 1)
        intraDayCurrent = intraDayCurrent[0]

        if(intraDayCurrent == undefined) return resolve()

        let isClosed = Number(intraDayCurrent.minute.replace(':', ''))+10 < Number(nowDate.getHours()+''+nowDate.getMinutes())
        
        if(body.error) return resolve()
        
        resolve({
          price: intraDayCurrent.price,
          closed: isClosed,
          volume: toNum(body.avg_volume)
        })
      })
    })
  }
}

function toNum(input) {
  input = input.replace(/,/g, '')
  input = Number(input)
  return input
}