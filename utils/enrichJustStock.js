var dataModel = require('../data/dataModel')
var fs = require('fs')
var enrichJustStock = function(data){

   for(var stock in data.coveredCallVsStock.justStock){
       data.coveredCallVsStock.justStock[stock].chartData.total.map(function(dateObj, i ){
       dateObj.price = dateObj.netValue/data.coveredCallVsStock.justStock[stock].position.leg1.count
       dateObj.delta = 100
       data.coveredCallVsStock.justStock[stock].chartData.total[i] = dateObj
     })
   }

   fs.writeFile('dataModel2.json', JSON.stringify(data, null, 4))


}



module.exports = enrichJustStock
