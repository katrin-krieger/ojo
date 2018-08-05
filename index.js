const https = require('https');
const querystring = require('querystring');
const pug = require('pug');
const fs = require('fs');

const weather_api = 'api.openweathermap.org';

const CITY_ID = 2875785; // = Lostau,DE
const API_KEY='fa7377f724468f6810460626fec5edd7';

function getCurrentWeather() {
  const options = {
      'id': CITY_ID,
      'APPID': API_KEY
  };

  performRequest('/data/2.5/weather', 'GET', options, function(data) {
    console.log('Result: ' + data.name);
  });
}


function performRequest(endpoint, method, data, success) {
  var dataString = JSON.stringify(data);
  var headers = {};

  if (method == 'GET') {
    endpoint += '?' + querystring.stringify(data);
  }
  else {
    headers = {
      'Content-Type': 'application/json',
      'Content-Length': dataString.length
    };
  }
  var options = {
    host: weather_api,
    path: endpoint,
    method: method,
    headers: headers
  };

  var req = https.request(options, function(res) {
    console.log("\nstatus code: ", res.statusCode);
    res.setEncoding('utf-8');

    var responseString = '';

    res.on('data', function(data) {
      responseString += data;
      console.log(responseString);
    });

    res.on('end', function() {
      //console.log(responseString);
      var responseObject = JSON.parse(responseString);
      success(responseObject);
    });

    res.on('error', function(err){
      console.log(err);
    })
  });

  req.write(dataString);
  req.end();
  return dataString;
}

getCurrentWeather();
const compiledFunction = pug.compileFile('index.pug');
console.log(compiledFunction({
  title: 'ojo weather forecast',
  todaystatus: '800'
}));

fs.writeFile("pug_test.html", compiledFunction({
  title: 'ojo weather forecast',
  todaystatus: '800'
}), function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});
