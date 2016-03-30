var dataModel = require('../data/dataModel')
var fs = require('fs')
var addTotalChangePL = function(data){
  console.log(data);
    for(var leg in data.coveredCallVsStock.coveredCall){
      thisLeg = data.coveredCallVsStock.coveredCall[leg]
      var lastDate
      thisLeg.chartData.total.map(function(date, i){
          if(i == 0){
            date.changePL = date.openPL;

          }
          else{
            date.changePL = date.openPL - lastDate.openPL
          }
          lastDate = date;
          data.coveredCallVsStock.coveredCall[leg].chartData.total[i] = date
      })

    }
    fs.writeFile('dataModel3.json', JSON.stringify(data, null, 4))


}

module.exports = addTotalChangePL
