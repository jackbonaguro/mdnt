const mongoose = require('mongoose');

const ReceiveSettingSchema = new mongoose.Schema({
    currency: {
        type: String,
        required: true,
        enum: ['BTC', 'BCH', 'ETH', 'XRP']
    },
    address: {
        type: String, // TODO: Per-currency address validator OR serialization. Polymorphic schema?
        required: true
    }
});

module.exports = mongoose.model('ReceiveSetting', ReceiveSettingSchema);