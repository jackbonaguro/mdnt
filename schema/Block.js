var mongoose = require('mongoose');

var BlockSchema = new mongoose.Schema({
  height: {
    type: Number,
    required: true,
    unique: true
  },
  hash: {
    type: String,
    required: true,
    unique: true
  },
  transactions: {
      type: Object,
      required: true,
      default: {}
  },
  receivingAddresses: {
    type: Array,
    required: true,
    default: []
  },
  processed: {
    type: Boolean,
    required: true,
    default: false
  }
}, { minimize: false });

BlockSchema.index({ height: 1 });
BlockSchema.index({ hash: 1 });

module.exports = mongoose.model('Block', BlockSchema);