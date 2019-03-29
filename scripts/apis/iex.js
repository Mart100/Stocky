const { IEXClient } = require('iex-api')
const _fetch = require('isomorphic-fetch')

const iex = new IEXClient(_fetch)

module.exports = {
  getCompanyInfo(symbol) {
    return new Promise((resolve, reject) => {
      iex.stockCompany(symbol).then(company => {
        resolve(company)
      })
    })
  }
}