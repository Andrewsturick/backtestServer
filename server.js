'use strict';
let express = require('express')
let morgan = require('morgan')
let bodyParser = require('body-parser')
let getData = require('./utils/getData')
let enrichData = require('./utils/enrichData')
let dataModel = require('./data/dataModel')
let yql = require('yql')
let fs = require('fs')
let enrichJustStock = require('./utils/enrichJustStock')
let addTotalChangePL = require('./utils/addTotalChangePL')
let readObject = require('./utils/readObject')
let requestObjectPossibilities = require('./utils/requestObjects')
require('dotenv').config()




let app = express();

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};
app.use(allowCrossDomain)
app.post('/', function(req, res){

  // getData(['AAPL', 'NFLX', 'LNKD', 'FB', 'FXE'])
  // var newData = enrichData(dataModel)
  // fs.writeFile('dataModel.json', JSON.stringify(newData, null, 4))
  var newData = enrichJustStock(dataModel)
  var newData2 = addTotalChangePL(dataModel)
  switch ( readObject(req.body) ){
    case  "coveredCall1":
      res.send(dataModel.coveredCallVsStock.coveredCall)
      break;
    case   "justStock1":
      res.send(dataModel.coveredCallVsStock.justStock)
      break;
    default:
      res.send('no match')
    }

})



console.log(process.env.PORT || 3000)
app.listen(process.env.PORT || 3000)
