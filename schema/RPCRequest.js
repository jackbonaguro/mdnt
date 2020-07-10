const mongoose = require('mongoose');
const util = require('util');
const bitcoreLibCash = require('bitcore-lib-cash');

const Block = require('./Block');
const Transaction = require('./Transaction');

const RPC_STATUSES = {
    new: 'new',
    processing: 'processing'
};

const processNewBlock = (newBlock) => {
    try {
        console.log('Process New Block');
        console.log(newBlock);
        const transactions = {};
        for (txid of newBlock.result.tx) {
            transactions[txid] = {
                processed: false
            };
        }
        return new Block({
            height: newBlock.result.height,
            hash: newBlock.result.hash,
            transactions
        }).save((err) => {
            if (err) {
                console.error(err);
            }
            Object.keys(transactions).map((txid) => {
                console.log('Save tx: ', txid);
                return new Transaction({
                    hash: txid,
                    block: newBlock.result.hash
                }).save((err) => {
                    if (err) {
                        console.error(err);
                    }
                    return RPCRequestModel.create('getRawTransaction', [txid], 'processNewBlockTransaction', (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                });
            });
        });
    } catch (e) {
        return console.error(e);
    }
};

const processNewBlockTransaction = (rawTx, params) => {
    try {
        console.log('Process New Block Transaction');
        console.log(rawTx.result);
        console.log(params);
        const bitcoreTx = new bitcoreLibCash.Transaction(rawTx.result);
        const receivingAddresses = bitcoreTx.outputs.map((output) => {
            if (output.script.isPublicKeyHashOut()) {
                return new bitcoreLibCash.Address(output.script.getPublicKeyHash(), 'testnet').toCashAddress();
            } else {
                return;
            }
        }).filter(o => (o));
        console.log(receivingAddresses);
        return Transaction.findOne({
            hash: params[0]
        }, (err, tx) => {
            if (err) {
                console.error(err);
            }
            console.log(tx);
            let update = {
                $addToSet: {
                    receivingAddresses: {
                        $each: receivingAddresses
                    }
                }
            };
            update[`transactions.${tx.hash}`] = {
                processed: true,
                receivingAddresses,
                rawTx: rawTx.result
            };
            Block.findOneAndUpdate({
                hash: tx.block
            }, update, {}, (err, block) => {
                if (err) {
                    console.error(err);
                }
                console.log(block);
            });
            Transaction.findOneAndUpdate({
                hash: tx.hash
            }, {
                $addToSet: {
                    receivingAddresses: {
                        $each: receivingAddresses
                    }
                }
            }, {}, (err, updatedTx) => {
                if (err) {
                    console.error(err);
                }
            });
        });
    } catch (e) {
        return console.error(e);
    }
};

let counter = 0;
const log = (response) => {
    counter += 1;
    console.log(`${counter}:\t${util.inspect(response)}`);
};
const responseHandlers = {
    processNewBlock,
    processNewBlockTransaction,
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
        responseHandlers[this.callback](response, this.params);
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