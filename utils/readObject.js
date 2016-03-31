'use strict'
var _ = require('lodash')

let readObject = function(requestObj){


     var coveredCallRequest=  { A: {
                                       '1': '1/4/16 - nextFullExpiration("1/4/16")',
                                       '2': 'stockArray(["NFLX","AAPL", "FB", "LNKD", "FXE"])',
                                       '3': 'enterAtOpen("1/4/16")'
                                   },
                                B: {   '1': 'closeAtClose(nextFullExpiration("1/4/16"))'},
                                C: {   '1': 'leg1(coveredCall($stock, "3OTM", 1))' },
                                D: {
                                       '1': 'symbol',
                                       '2': 'P/L',
                                       '3': 'roc',
                                       '4': 'daysHeld'
                                   }
                                }
     var justStock= { A: {
                                       '1': '1/4/16 - nextFullExpiration("1/4/16")',
                                       '2': 'stockArray(["NFLX","AAPL", "FB", "LNKD", "FXE"])',
                                       '3': 'enterAtOpen("1/4/16")'
                                   },
                                B: {   '1': 'closeAtClose(nextFullExpiration("1/4/16"))'},
                                C: {   '1': 'leg1(stock($stock, 100))' },
                                D: {
                                       '1': 'symbol',
                                       '2': 'P/L',
                                       '3': 'roc',
                                       '4': 'daysHeld'
                                   }
                                }



     console.log(requestObj ,coveredCallRequest)
     if (_.isEqual(requestObj,coveredCallRequest)){
       console.log('.///////////');
       return "coveredCall1"
     }
     if (_.isEqual(requestObj,justStock)){
       console.log('.///////////');
       return "justStock1"
     }
}


module.exports = readObject;
