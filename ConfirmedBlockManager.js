const Account = require('./schema/Account');
const Transaction = require('./schema/Transaction');
const Block = require('./schema/Block');
const Donation = require('./schema/Donation');

class ConfirmedBlockManager {
    constructor() {
    }

    start(callback) {
        return this.initializeBlockStream(callback);
    }

    initializeBlockStream(callback) {
        this.blockStream = Block.watch(null, {
            fullDocument: 'updateLookup'
        }).on('change', (change) => {
            this.handleBlockChange(change);
        }).on('error', (err) => {
            console.error(err);
        }).on('close', (err) => {
            this.initializeBlockStream();
        });
        console.log('Block Stream Initialized');
        return callback();
    }

    handleBlockChange(change) {
        if (change.operationType === 'update') {
            console.log(change);
            let transactions = change.fullDocument.transactions;
            let allTxsProcessed = Object.values(transactions).reduce((acc, isProcessed) => {
                return (acc || isProcessed);
            }, false);
        
            // Only process block if all its transactions are processed (each will cause a blockStream 'update' event)
            if (!allTxsProcessed) {
                return console.log('Skipping block that is still processing');
            }
            console.log('All txs processed; notifying addresses');
        
            console.log(change.fullDocument);
        
            let blockHash = change.fullDocument.hash;
            let blockHeight = change.fullDocument.height;
            let receivingAddresses = change.fullDocument.receivingAddresses;
        
            // If any of the receiving addresses match an account, we must notify
            Account.find({
                receiveSettings: {
                    $elemMatch: {
                        currency: 'BCH',
                        address: {
                            $in: receivingAddresses
                        }
                    }
                }
            }).cursor().on('data', (account) => {
                let receivingAddress = account.receiveSettings.find((rs) => {
                    return receivingAddresses.includes(rs.address);
                }).address;
                let receivingTxid = Object.keys(transactions).find((txid) => {
                    return !!(
                        transactions[txid] &&
                        transactions[txid].receivingAddresses &&
                        transactions[txid].receivingAddresses.length &&
                        transactions[txid].receivingAddresses.includes(receivingAddress)
                    );
                });
                // Notify the account
                let donation = new Donation({
                    account: account._id,
                    transaction: receivingTxid,
                    receivingAddress: receivingAddress
                });
                console.log(donation);
                donation.save((err) => {
                    if (err) {
                        console.error(err);
                    }
                });
            }).on('error', (err) => {
                console.error(err);
            }).on('end', () => {
                console.log('Finished processing block');
            });
        }
    };
}

let confirmedBlockManager = new ConfirmedBlockManager();
module.exports = confirmedBlockManager;