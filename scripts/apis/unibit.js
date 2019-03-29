const request = require('request')
const _ = require('lodash')

let avURL = 'https://www.alphavantage.co/query?'
let apiKey = 'sp8z3-wUMIvuz8APwtD2-OC57YEEi1wA'



module.exports = {
  getCompanyInfo(symbol) {
    return new Promise((resolve, reject) => {
      request(`https://api.unibit.ai/companyprofile/${symbol}?AccessKey=${apiKey}`, async (err, res, body) => {
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
  getStockInfo(symbol) {
    return new Promise((resolve, reject) => {
      request(`https://api.unibit.ai/financials/summary/${symbol}?AccessKey=${apiKey}`, async (err, res, body) => {
        body = JSON.parse(body)

        if(body.error) return resolve()
        
        resolve({
          price: toNum(body.open),
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