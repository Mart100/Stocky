const request = require('request')
const _ = require('lodash')
const fs = require('fs')
const { createCanvas } = require('canvas')
const canvas = createCanvas(450, 180)
let cw = canvas.width
let ch = canvas.height
const ctx = canvas.getContext('2d')


async function createChart(data) {
  return new Promise((resolve, reject) => {

    // sort data on date
    data.sort((a, b) => a.time - b.time)

    
    // functions
    let refinedData = getRefinedData(data)
    drawBackground('#FFFFFF')
    drawDataLine(refinedData)
    drawPrices(data)
    drawDates(data)


    let stream = canvas.createPNGStream()
    resolve(stream)

  })
}

module.exports = createChart

function drawBackground(color) {
  ctx.fillStyle = color
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function drawDataLine(refinedData) {
  // draw it
  ctx.strokeStyle = 'black'
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
  ctx.beginPath()
  ctx.moveTo(0, ch)

  for(let i in refinedData) {
    let d = refinedData[i]
    ctx.lineTo(d.x, d.y)
  }
  ctx.lineTo(cw, ch)
  ctx.closePath()
  ctx.stroke()
  ctx.fill()

}

function getRefinedData(data) {

  // some variables
  let unsortedData = JSON.parse(JSON.stringify(data))
  let lowestX = unsortedData.sort((a, b) => a.time - b.time)[0].time
  let highestX = unsortedData.sort((a, b) => b.time - a.time)[0].time
  let lowestY = unsortedData.sort((a, b) => a.price - b.price)[0].price
  let highestY = unsortedData.sort((a, b) => b.price - a.price)[0].price

  // refine data
  let refinedData = []

  for(let i in data) {
    let d = data[i]
    let x = ((d.time - lowestX) / (highestX - lowestX))*cw
    let y = ((d.price - lowestY) / (highestY - lowestY))*(ch-20)

    // revert y
    y = ch - y

    y -= 10

    refinedData.push({x: x, y: y})
  }

  return refinedData
}
function drawPrices(data) {
  // some variables
  let unsortedData = JSON.parse(JSON.stringify(data))
  let lowestY = unsortedData.sort((a, b) => a.price - b.price)[0].price
  let highestY = unsortedData.sort((a, b) => b.price - a.price)[0].price

  // draw background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
  ctx.fillRect(0, 0, 35, ch)

  // prepare drawing
  ctx.fillStyle = 'rgba(255, 255, 255, 1)'
  ctx.font = '12px Arial'

  // drawing
  for(let i=1;i<5;i++) {
    let y = i/5 * ch
    if(i > 4) continue
    let price = ((ch-y)/ch) * (highestY-lowestY) + lowestY

    let priceLength = Math.round(price).toString().length
    let roundPower = Math.pow(10, 4-priceLength)
    // round to 2 digits
    price = Math.round(price*roundPower)/roundPower


    ctx.fillText(price, 5, y)
  }
}

function drawDates(data) {
  // some variables
  let unsortedData = JSON.parse(JSON.stringify(data))
  let lowestX = unsortedData.sort((a, b) => a.time - b.time)[0].time
  let highestX = unsortedData.sort((a, b) => b.time - a.time)[0].time

  // draw background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
  ctx.fillRect(0, ch-20, cw, ch)

  // prepare drawing
  ctx.fillStyle = 'rgba(255, 255, 255, 1)'
  ctx.font = '12px Arial'

  // drawing
  for(let i=1;i<10;i++) {
    let x = i/10 * cw
    let date = new Date((x/cw) * (highestX-lowestX) + lowestX)
    let time = date.getHours() + ':' + date.getMinutes()

    ctx.fillText(time, x, ch-7)
  }
}