'use strict';

let GotapiPlugin = function(util) {
  this.util = util;
  this.info = {
    name: 'Hello test',
    services: [
      {
        serviceId : 'com.test.hello',
        name      : 'hello test',
        online    : true,
        scopes    : ['echo']
      }
    ]
  };
};

GotapiPlugin.prototype.init = function(callback) {
  this.util.init(this.info);
  this.util.onmessage = this.receiveMessage.bind(this);
  callback(this.info);
};

GotapiPlugin.prototype.receiveMessage = function(message) {
  if(message['profile'] === 'echo') {
    message['result'] = 0;
    var request = require('request');
    var options = {
      url: 'https://script.google.com/macros/s/AKfycbxR0iNKUtsMi-XlEksVYt3q7C-mU2NPuXIZg_q_6mCPJ6tqOCBg/exec',
      method: 'GET',
      json: true
    }
    request(options, function (error, response, body) {
        console.log(body);
    })
    // const https = require('https');
    // const options = {
    //   protocol: 'https:',
    //   host: 'script.google.com',
    //   path: '/macros/s/AKfycbxR0iNKUtsMi-XlEksVYt3q7C-mU2NPuXIZg_q_6mCPJ6tqOCBg/exec',
    //   method: 'GET',
    //   followAllRedirects : true,
    // };
    // const req = https.request(options, (res) => {
    //     res.on('data', (chunk) => {
    //         console.log(`BODY: ${chunk}`);
    //     });
    //     res.on('end', () => {
    //         console.log('No more data in response.');
    //     });
    // })

    // req.on('error', (e) => {
    //   console.error(`problem with request: ${e.message}`);
    // });

    // req.end();

    message['data'] = message['params']['msg'];
  } else {
    message['result'] = 1001;
    message['errorMessage'] = 'Unknow profile was requested.';
  }
  this.util.returnMessage(message);
};

module.exports = GotapiPlugin;