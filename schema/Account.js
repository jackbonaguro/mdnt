const mongoose = require('mongoose');
const request = require('request');

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
  receiveSettings: [Object]
}, { minimize: false });

Account.index({ email: 1 });

Account.methods.sendReceiveEmail = (blockHash, receivingAddress, receivingTxid, callback) => {
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

module.exports = mongoose.model('Account', Account);