var mongoose = require('mongoose');

var TransactionSchema = new mongoose.Schema({
  rawTx: {
    type: String,
    unique: false
  },
  hash: {
    type: String,
    required: true,
    unique: true
  },
  receivingAddresses: {
    type: Array,
    required: true,
    default: []
  },
  block: String
}, { minimize: false });

TransactionSchema.index({ hash: 1 });

module.exports = mongoose.model('Transaction', TransactionSchema);