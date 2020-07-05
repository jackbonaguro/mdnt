#!/usr/bin/env node

const RPCRequest = require('./schema/RPCRequest');
const RPCRequestManager = require('./RPCRequestManager');
const mongoose = require('mongoose');

const txid = 'e1d944dc8509776c758834dc726fac70cb18495cd4fc525ed582a498e02b9dbf';

const transactions = [];

// Got it; local regtest is around 50 / 50 at 24 concurrent requests. 16 (default rpcworkqueue) should be safe.
for (let i = 0; i < 24; i++) {
    transactions.push(txid);
}
mongoose.connect('mongodb://127.0.0.1/midnightcash-test', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', () => {
    console.log('DB open');
    RPCRequestManager.start();
    Promise.all(transactions.map((txid) => {
        RPCRequest.create(
            'getRawTransaction',
            [txid],
            'log',
            (err) => {
                if (err) {
                    return console.error(err);
                }
            }
        );
        return Promise.resolve();
    })).then(() => {
        // console.log('Done!');
        setTimeout(() => {
            console.log('Done');
        }, 5000);
    }).catch((err) => {
        console.error(err);
    });
});