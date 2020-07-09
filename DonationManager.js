const Account = require('./schema/Account');
const Transaction = require('./schema/Transaction');
const Block = require('./schema/Block');
const Donation = require('./schema/Donation');

class DonationManager {
    constructor() {
    }

    start(callback) {
        return this.initializeDonationStream(callback);
    }

    initializeDonationStream(callback) {
        this.donationStream = Donation.watch(null, {
            fullDocument: 'updateLookup'
        }).on('change', (change) => {
            this.handleDonationChange(change);
        }).on('error', (err) => {
            console.error(err);
        }).on('close', (err) => {
            this.initializeDonationStream();
        });
        console.log('Donation Stream Initialized');
        return callback();
    }

    handleDonationChange(change) {
        if (change.operationType === 'insert') {
            let {
                _id: donationId,
                account: accountId,
                transaction: receivingTxid,
                receivingAddress
            } = change.fullDocument;

            // Brand new donation, we must process all notifications here
            Account.findOne({
                _id: accountId
            }, (err, account) => {
                if (err) {
                    console.error(err);
                }
                if (!account) {
                    console.error(new Error('Donation received for non-existent account'));
                }
                Transaction.findOne({
                    hash: receivingTxid
                }, (err, transaction) => {
                    if (err) {
                        console.error(err);
                    }
                    if (!account) {
                        console.error(new Error('Donation received for non-existent transaction'));
                    }
                    console.log('Notifying');
                    // account.sendReceiveEmail(transaction.block, receivingAddress, receivingTxid, (err) => {
                    //     if (err) {
                    //         console.error(err);
                    //     }
                    //     Donation.findOneAndUpdate({
                    //         _id: change.fullDocument._id
                    //     }, {
                    //         processed: true
                    //     }, (err) => {
                    //         if (err) {
                    //             console.error(err);
                    //         }
                    //     });
                    // });
                    account.sendDonationNotification(donationId, transaction, (err) => {
                        if (err) {
                            console.error(err);
                        }
                        Donation.findOneAndUpdate({
                            _id: change.fullDocument._id
                        }, {
                            processed: true
                        }, (err) => {
                            if (err) {
                                console.error(err);
                            }
                        });
                    });
                });
            });
        }
    };
}

let donationManager = new DonationManager();
module.exports = donationManager;