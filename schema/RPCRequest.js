const mongoose = require('mongoose');
const util = require('util');

const RPC_STATUSES = {
    new: 'new',
    processing: 'processing'
};

const processNewBlock = function(response) {
    console.log('Process New Block');
    console.log(response);
};

let counter = 0;
const log = (response) => {
    counter += 1;
    console.log(`${counter}:\t${util.inspect(response)}`);
};
const responseHandlers = {
    processNewBlock,
    log
};

const RPCRequest = new mongoose.Schema({
  method: {
      type: String,
      required: true,
      enum: ['getBlock', 'getRawTransaction', 'decodeRawTransaction']
  },
  params: [String],
  callback: {
      type: String
  },
  status: {
      type: String,
      required: true,
      default: RPC_STATUSES.new,
      enum: Object.values(RPC_STATUSES)
  }
}, { minimize: false });

RPCRequest.statics.create = function(method, params, callback, done) {
    let rpcRequest = new RPCRequestModel({
        method,
        params,
        callback
    });
    return rpcRequest.save((err) => {
        if (err) {
            return done(err);
        }
        return done();
    });
};

RPCRequest.methods.handleResponse = function(response, callback) {
    this.remove((err) => {
        if (err) {
            return callback(err);
        }
        responseHandlers[this.callback](response);
        return callback();
    });
};

RPCRequest.methods.execute = function(rpcClient, callback) {
    rpcClient[this.method](...this.params, (err, result) => {
        if (err) {
            return callback(err);
        }
        return callback(null, result);
    });
};

const RPCRequestModel = mongoose.model('RPCRequest', RPCRequest);
module.exports = RPCRequestModel;