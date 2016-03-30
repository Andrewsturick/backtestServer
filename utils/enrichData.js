'use strict';



let enrichData = function(data){
  /////////////////////////////////////
  //makes "total" array in each trade in covered calls
////////////////////////////////////////


var lastDay = {};

////first make values in each leg2 for open P/L, change P/L, and a few other necessary keys
  for( let trade in data.coveredCallVsStock.coveredCall ){


      let chartData =  data.coveredCallVsStock.coveredCall[trade].chartData;
      chartData.leg1.map(function(dayObject, i){
        data.coveredCallVsStock.coveredCall[trade].chartData.leg1[i].price =chartData.leg1[i].netValue / 100;
      })
      chartData.leg2.map(function(dayObject, i, array){
          if ( i == 0 ) {


            findFirstPL();

            function findFirstPL (){
              let totalEntry;

              for(let leg in data.coveredCallVsStock.coveredCall[trade].position){
                let legCopy = data.coveredCallVsStock.coveredCall[trade].position[leg]
                if (legCopy.type == "call" ){
                  totalEntry = Number(legCopy.count) * Number(legCopy.priceEnter) * 100
                  // console.log('TE1',totalEntry)
                }
                else{
                  totalEntry = Number(legCopy.count) * Number(legCopy.priceEnter)
                  // console.log('TE', totalEntry)
                }
                data.coveredCallVsStock.coveredCall[trade].position[leg].totalEnter = totalEntry
                // console.log('TECHECK', data.coveredCallVsStock.coveredCall[trade].position[leg].totalEnter)
                data.coveredCallVsStock.coveredCall[trade].position[leg].stock = data.coveredCallVsStock.coveredCall[trade].stock

              }
              dayObject.openPL = -(dayObject.netValue - Math.abs(totalEntry))
              dayObject.openPL = Math.round(dayObject.openPL*100)/100;
              dayObject.changePL = dayObject.openPL;
              lastDay = dayObject

              data.coveredCallVsStock.coveredCall[trade].chartData.leg2[i] = dayObject
              // console.log(dayObject)
          }
        }
        else{

          dayObject.openPL = (data.coveredCallVsStock.coveredCall[trade].position.leg2.priceEnter*100)-dayObject.netValue;
          dayObject.changePL = lastDay.openPL - dayObject.openPL
          lastDay = dayObject
          data.coveredCallVsStock.coveredCall[trade].chartData.leg2[i] = dayObject
        }
      })
  }

///makes total entry price for each trade
 for(let trade in data.coveredCallVsStock.coveredCall){
   let total = 0;
   for( let posLeg in data.coveredCallVsStock.coveredCall[trade].position){
     let secType = data.coveredCallVsStock.coveredCall[trade].position[posLeg].type
    //  total+=coveredCall data.coveredCallVsStock.coveredCall[trade].position[posLeg].totalEnter
     if(secType == "call" ){
      //  console.log('call ',data.coveredCallVsStock.coveredCall[trade].position[posLeg].totalEnter)
       total = total + data.coveredCallVsStock.coveredCall[trade].position[posLeg].totalEnter;
     } else{
      //  console.log('stock', data.coveredCallVsStock.coveredCall[trade].position[posLeg].totalEnter)

       total= total +  data.coveredCallVsStock.coveredCall[trade].position[posLeg].totalEnter
     }

      // console.log(trade, total)
   }
   data.coveredCallVsStock.coveredCall[trade].totalEntryPositionCostOrDebit = total;
  //  console.log('TOTAL: ',total);

 }




  for( let trade in data.coveredCallVsStock.coveredCall ){
    var totalArray = [];
    let lastDay = {}
    var obj = data.coveredCallVsStock.coveredCall[trade]
    obj.chartData.leg1.map(function(day, i, array){
      let totalDayObject = {};
      totalDayObject.openPL = 0
      totalDayObject.changePL = 0
      totalDayObject.netValue = 0
      totalDayObject.delta = 0
      totalDayObject.price = 0
      totalDayObject.date = day.date
      for(var eachLeg in obj.chartData){
        if(eachLeg != "stockData") {
          try{
            totalDayObject.openPL = totalDayObject.openPL + obj.chartData[eachLeg][i].openPL
          }catch(e){}
            // console.log(eachLeg, obj.chartData[eachLeg][i].openPL);
            if(!totalDayObject.symbol) totalDayObject.symbol = obj.chartData[eachLeg][i].symbol
            if(eachLeg=="leg1"){
              totalDayObject.netValue = totalDayObject.netValue + obj.position[eachLeg].count * obj.chartData[eachLeg][i].price
              totalDayObject.delta = totalDayObject.delta + obj.position.leg1.totalDelta
            }else
            try{
              totalDayObject.netValue = totalDayObject.netValue + (obj.position[eachLeg].count * obj.chartData[eachLeg][i].price*100)
              totalDayObject.delta = totalDayObject.delta + (obj.chartData[eachLeg][i].delta * 100 * obj.position[eachLeg].count)

            }  catch(e){}

            }

            totalDayObject.price = totalDayObject.netValue / 100;


        }


      totalArray.push(totalDayObject)


    })

    data.coveredCallVsStock.coveredCall[trade].chartData.total = totalArray

}





   data.coveredCallVsStock.coveredCall.trade1.chartData.total.map(function(dateObj, i, array){
      for( var specialKey in data.coveredCallVsStock.coveredCall.trade1.chartData.total[i-1]){
        if(specialKey = "openPL"){
        data.coveredCallVsStock.coveredCall.trade1.chartData.total[i].changePL =  -(data.coveredCallVsStock.coveredCall.trade1.chartData.total[i-1][specialKey] - dateObj.openPL)
        }
      }


   })

   for(var eachTrade in data.coveredCallVsStock.coveredCall){

      data.coveredCallVsStock.coveredCall[eachTrade].maxPossibleLoss = data.coveredCallVsStock.coveredCall[eachTrade].position.leg1.totalEnter  + data.coveredCallVsStock.coveredCall[eachTrade].position.leg2.totalEnter
      var length = data.coveredCallVsStock.coveredCall[eachTrade].chartData.total.length-1
       data.coveredCallVsStock.coveredCall[eachTrade].PandL =  data.coveredCallVsStock.coveredCall[eachTrade].chartData.total[length].openPL
       data.coveredCallVsStock.coveredCall[eachTrade].roc = data.coveredCallVsStock.coveredCall[eachTrade].PandL/5000;

       data.coveredCallVsStock.coveredCall[eachTrade].priceEnter = data.coveredCallVsStock.coveredCall[eachTrade].position.leg1.priceEnter  + (data.coveredCallVsStock.coveredCall[eachTrade].position.leg2.priceEnter * data.coveredCallVsStock.coveredCall[eachTrade].position.leg2.count)
       data.coveredCallVsStock.coveredCall[eachTrade].priceExit = data.coveredCallVsStock.coveredCall[eachTrade].position.leg1.priceExit  + (data.coveredCallVsStock.coveredCall[eachTrade].position.leg2.priceExit * data.coveredCallVsStock.coveredCall[eachTrade].position.leg2.count)
       data.coveredCallVsStock.coveredCall[eachTrade].totalPriceEnter = data.coveredCallVsStock.coveredCall[eachTrade].maxPossibleLoss
       data.coveredCallVsStock.coveredCall[eachTrade].totalPriceExit = data.coveredCallVsStock.coveredCall[eachTrade].priceExit * 100
   }






   for(var stockTrade in data.coveredCallVsStock.justStock){
         data.coveredCallVsStock.justStock[stockTrade].chartData = {};
           data.coveredCallVsStock.justStock[stockTrade].chartData.leg1 =  data.coveredCallVsStock.justStock[stockTrade].position.leg1.chartData.leg1
           data.coveredCallVsStock.justStock[stockTrade].chartData.total =      data.coveredCallVsStock.justStock[stockTrade].position.leg1.chartData.leg1
           delete data.coveredCallVsStock.justStock[stockTrade].position.leg1['chartData']
           data.coveredCallVsStock.justStock[stockTrade].position.leg1.delta = 1;
           data.coveredCallVsStock.justStock[stockTrade].position.leg1.totalDelta = 100;

         }
         return data
   }



module.exports = enrichData;
