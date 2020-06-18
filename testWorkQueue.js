#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const request = require('request');
const bitcoreLibCash = require('bitcore-lib-cash');
const rpcClient = require('bitcoind-rpc');
const mongoose = require('mongoose');

const rpc = new rpcClient(process.env.RPCSTRING);

const txid = 'e1d944dc8509776c758834dc726fac70cb18495cd4fc525ed582a498e02b9dbf';

const transactions = [];

// Got it; local regtest is around 50 / 50 at 24 concurrent requests. 16 (default rpcworkqueue) should be safe.
for (let i = 0; i < 24; i++) {
    transactions.push(txid);
}

Promise.all(transactions.map((txid) => {
    return new Promise((resolve, reject) => {
        rpc.getRawTransaction(txid, (err, rawTx) => {
            if (err) {
                return reject(err);
            }
            if (!rawTx || !rawTx.result) {
                return reject(new Error('Failed to getRawTransaction for '+txid));
            }
            return resolve(rawTx.result);
        });
    });
})).then(() => {
    console.log('Done!');
}).catch((err) => {
    console.error(err);
});