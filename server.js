require('dotenv').config();
const config = require('./config/config');
const express = require('express');
const request = require('request');
const cors = require('cors');
const app = express();
const port = config.port;
const rateLimit = require("express-rate-limit");

//Limit repeated requests to public APIs
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10
});
app.use("/categories/", apiLimiter);
 
// Blacklist the following IPs
ipfilter = require('express-ipfilter').IpFilter
var ips = ['10.0..1'];
app.use(ipfilter(ips));

// Add this to the VERY top of the first file loaded in your app
var apm = require('elastic-apm-node').start({
  // Override service name from package.json
  // Allowed characters: a-z, A-Z, 0-9, -, _, and space
  serviceName: '',
  captureBody: 'all',
  
  // Use if APM Server requires a token
  secretToken: 'fp2VzNRlLb2IXnZf5T',

  // Set custom APM Server URL (default: http://localhost:8200)
  serverUrl: 'https://67a6aa3c74d043b1be0079038609d990.apm.us-east-1.aws.cloud.es.io:443'
})

app.use(cors());
app.use('/', function(req, res) {

  //Take the baseurl from your api and also supply whatever 
  //route you use with that url
  let url =  config.apiUrl + req.url;
  let query = config.assignKey(req.query);

  //Pipe is through request, this will just redirect 
  //everything from the api to your own server at localhost. 
  //It will also pipe your queries in the url
  req.pipe(request({ qs: query , uri: url })).pipe(res);
});

//Start the server by listening on a port
app.listen(port, () => {
  console.log(`|  [\x1b[34mSERVER\x1b[37m] Listening on port: \x1b[36m${port} 🤖  \x1b[37m |`);
});
