const mongoose = require('mongoose');
const request = require('request');
const { Transform } = require('stream');

const Donation = require('./Donation');
const Transaction = require('./Transaction');

const Account = new mongoose.Schema({
  email: {
    type: String, // TODO: Email validator
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
      type: String,
      required: true
  },
  receiveSettings: [Object],
  notificationSettings: {
    type: Object,
    required: true,
    default: {
      email: true,
      webHook: false,
      push: false
    }
  }
}, { minimize: false });

Account.index({ email: 1 });

Account.methods.sendReceiveEmail = function(blockHash, receivingAddress, receivingTxid, callback) {
    request.post({
        uri: 'https://maker.ifttt.com/trigger/receive_tx/with/key/eLSE-nh_zD_CcW6IDrRUziAJvmIfeo5HpSmR-amK3qZ',
        json: {
            value1: blockHash,
            value2: receivingAddress,
            value3: receivingTxid
        }
    }, (err) => {
        if (err) {
            return callback(err);
        }
        return callback();
    });
};

Account.methods.sendDonationNotification = function(donationId, transaction, callback) {
  if (!this.notificationSettings) {
    return callback(new Error('Account missing notificationSettings'));
  }
  Donation.findOne({
    _id: donationId
  }, (err, donation) => {
    if (err) {
      return callback(err);
    }
    if (!donation) {
      return callback(new Error('Attempted notification for non-existent donation'));
    }
    // Email
    if (this.notificationSettings.email) {
      request.post({
        uri: 'https://maker.ifttt.com/trigger/receive_tx/with/key/eLSE-nh_zD_CcW6IDrRUziAJvmIfeo5HpSmR-amK3qZ',
        json: {
            value1: transaction.block,
            value2: donation.receivingAddress,
            value3: donation.transaction
        }
      }, (err) => {
          if (err) {
              return callback(err);
          }
          return callback();
      });
    }
  });
};

Account.methods.updateNotificationSettings = function(update, callback) {
  let newSettings = {
    ...this.notificationSettings,
    ...update
  };
  console.log(newSettings);
  if (newSettings.webHook && !newSettings.webHookURL) {
    return callback(new Error('Can\'t enable webHook without a URL'));
  }
  this.notificationSettings = newSettings;
  this.markModified('notificationSettings');
  this.save(callback);
};

// TODO: This whole endpoint needs to stream JSONL for scalability
Account.methods.getDonations = function() {
  const cursor = Donation.find({
    account: this._id
  }).cursor();

  let populateCurrency = new Transform({
    objectMode: true,
    transform: (donation, _, done) => {
      return Transaction.findOne({
        hash: donation.transaction
      }, (err, tx) => {
        if (err) {
          return done(err);
        }
        console.log(tx);
        return done(null, `${JSON.stringify({
          receivingAddress: donation.receivingAddress,
          transaction: donation.transaction,
          block: donation.block,
          currency: 'BCH' // TODO: Must add currency to all schemas
        })}\n`);
      });
    }
  })
  cursor.pipe(populateCurrency);
  return populateCurrency;
};

// Can't use arrow function due to dropping of `this`
Account.methods.getAccount = function () {
  let self = this;
  return {
    email: self.email,
    username: self.username,
    receiveSettings: self.receiveSettings,
    notificationSettings: self.notificationSettings
  };
};

const AccountModel = mongoose.model('Account', Account);
module.exports = AccountModel;