'use strict';
var YQL = require('yql')
var helpers = require('./helpers')
var fs = require('fs')
var dataModel = require('../data/dataModel')


////////////////////////////////
//original stock data fetcher
/////////////////////////////////
/////////////////////////////////

let getData = function(stocks){
  ///makes yahoo query
    var query = helpers.YQLQuery(stocks);
    ///gets query results back, exposes them in "data" in callback
    query.exec(function(err, data){
      ///empty object to hold quotes organized by stock
         let dataObj = {}

      //maps through results and sorts them
         data.query.results.quote.map(function(quote){
                 //symbol of stock
                 let symbol = quote.Symbol
                 //if property for that symbol doesnt exist in this.data, initialize it as empty array
                 if(!dataObj[symbol]){
                    dataObj[symbol] = {};
                    dataObj[symbol].stockData = [];
                 }
                 //makes object of arrays....quotes for each stock
                 dataObj[symbol].stockData.push(quote)

         })


         //then go back and use the stock data to make the leg data....map through each stock
          for(let stock in dataObj){
            //make an array called legData for each stock in our dataObj
            dataObj[stock].legData = []
            //map through every quote in the stock's stock data afer
            dataObj[stock].stockData = dataObj[stock].stockData.reverse()
            dataObj[stock].stockData.map(function(quote, i){
              //each stock day in the stock data will have a corresponding
              //day's worth of position data...so initialize an object for eaech day
              let legDay = {};
              //calculate the position's open p/l, change in p/l, and net worth
              //set them to keys in that day's 'legDay' object
              legDay.symbol = quote.Symbol;
              legDay.date = quote.Date
              legDay.netValue = 100 * quote.Close;
              legDay.Volume = quote.Volume;



              //if it's not the first day of the series:
              //change p/l is equal to diff of open to close
              //open p/l is sum of previous days' open p/l plus that day's changePL
              //otherwise change p/l and open p/l equals difference of previous day's net value and that day's (at close)

              if(i>0){
                legDay.changePL = legDay.netValue - dataObj[stock].legData[i-1].netValue
                legDay.openPL = dataObj[stock].legData[i-1].openPL + legDay.changePL
              }
              else {
                legDay.changePL = legDay.netValue - quote.Open*100
                legDay.openPL = legDay.changePL;
               }


              for( var eachKey in legDay ){
                 if(typeof legDay[eachKey] == "number"){
                    legDay[eachKey] = Math.round(legDay[eachKey]*100)/100
                 }
              }


              //push object to array of position records
              dataObj[stock].legData.push(legDay)







            })
          }

    })





}
//////////////



module.exports = getData;
