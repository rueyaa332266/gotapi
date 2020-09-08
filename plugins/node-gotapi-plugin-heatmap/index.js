'use strict';

let GotapiPlugin = function(util) {
  this.util = util;
  this.info = {
    name: 'Heatmap',
    services: [
      {
        serviceId : 'com.heatmap',
        name      : 'heatmap api',
        online    : true,
        scopes    : ['area', 'temperature', 'humidity']
      }
    ]
  };
  this.heatmap_id = 0;
};

GotapiPlugin.prototype.init = function(callback) {
  this.util.init(this.info);
  this.util.onmessage = this.receiveMessage.bind(this);
  callback(this.info);
};

GotapiPlugin.prototype.receiveMessage = function(message) {
  if(message['profile'] === 'area' || message['profile'] === 'temperature' || message['profile'] === 'humidity') {
    this.heatmapGet(message);
  } else {
    message['result'] = 400;
    message['errorMessage'] = 'Unknow profile was requested.';
    this.util.returnMessage(message);
  }
};

GotapiPlugin.prototype.heatmapGet = function(message) {
  if(message['method'] === 'get') {
    if(message['profile'] === 'area') {
      this.getArea(message);
    } else if(message['profile'] === 'temperature') {
      this.getAreaTemp(message);
    } else if(message['profile'] === 'humidity') {
      this.getAreaHumi(message);
    }
  } else if(message['method'] === 'delete') {
    this.stopShowing(message);
  } else {
    message['result'] = 400;
    message['data'] = null;
    message['errorMessage'] = 'The HTTP Method `' + message['method'] + '` is not supported.';
    this.util.returnMessage(message);
  }
};

GotapiPlugin.prototype.getArea = function(message) {
  message['result'] = 0;
  message['data'] = null;
  this.util.returnMessage(message);

  var request = require('request');
  var options = {
    url: 'https://script.google.com/macros/s/AKfycbxR0iNKUtsMi-XlEksVYt3q7C-mU2NPuXIZg_q_6mCPJ6tqOCBg/exec',
    method: 'GET',
    qs: {
      area: message['params']['area']
    },
    json: true
  }

  this.heatmap_id = setInterval(() => {
    message['result'] = 0;
    request(options, function (error, response, body) {
      message['data'] = body;
      console.log(body);
    })
    this.util.pushMessage(message);
  }, 3000);
};

GotapiPlugin.prototype.getAreaTemp = function(message) {
  message['result'] = 0;
  message['data'] = null;
  this.util.returnMessage(message);

  var request = require('request');
  var options = {
    url: 'https://script.google.com/macros/s/AKfycbxR0iNKUtsMi-XlEksVYt3q7C-mU2NPuXIZg_q_6mCPJ6tqOCBg/exec',
    method: 'GET',
    qs: {
      area: message['params']['area']
    },
    json: true
  }

  this.heatmap_id = setInterval(() => {
    message['result'] = 0;
    request(options, function (error, response, body) {
      message['data'] = body.temperature;
      // console.log(body.temperature);
    })
    this.util.pushMessage(message);
  }, 3000);
};

GotapiPlugin.prototype.getAreaHumi = function(message) {
  message['result'] = 0;
  message['data'] = null;
  this.util.returnMessage(message);

  var request = require('request');
  var options = {
    url: 'https://script.google.com/macros/s/AKfycbxR0iNKUtsMi-XlEksVYt3q7C-mU2NPuXIZg_q_6mCPJ6tqOCBg/exec',
    method: 'GET',
    qs: {
      area: message['params']['area']
    },
    json: true
  }

  this.heatmap_id = setInterval(() => {
    message['result'] = 0;
    request(options, function (error, response, body) {
      message['data'] = body.humidity;
      // console.log(body);
    })
    this.util.pushMessage(message);
  }, 3000);
};

GotapiPlugin.prototype.stopShowing = function(message) {
  if(this.heatmap_id) {
    clearInterval(this.heatmap_id);
    this.heatmap_id = 0;
  }
  message['result'] = 0;
  message['data'] = null;
  this.util.returnMessage(message);
};

module.exports = GotapiPlugin;