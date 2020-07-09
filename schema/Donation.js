var mongoose = require('mongoose');

var DonationSchema = new mongoose.Schema({
  receivingAddress: {
    type: String,
    required: true
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  transaction: {
      type: String, // txid
      required: true
  },
  processed: {
    type: Boolean,
    required: true,
    default: false
  }
}, { minimize: false });

// DonationSchema.index({ transaction: 1 });
DonationSchema.index({ account: 1 });

module.exports = mongoose.model('Donation', DonationSchema);