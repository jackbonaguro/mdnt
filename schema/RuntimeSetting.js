const mongoose = require('mongoose');
const request = require('request');

const RuntimeSetting = new mongoose.Schema({
  requests: [String],
  maxRequests: {
    type: Number,
    default: 0,
    required: true
  },
  rpcQueueHeight: {
    type: Number,
    default: 0,
    required: true
  }
}, { minimize: false });

RuntimeSetting.statics.startRequest = function() {};

module.exports = mongoose.model('RuntimeSetting', RuntimeSetting);