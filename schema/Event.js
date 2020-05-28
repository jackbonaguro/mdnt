var mongoose = require('mongoose');

var EventSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  data: {
    type: Object,
    required: true
  }
});

EventSchema.index({ type: 1 });

module.exports = mongoose.model('Event', EventSchema);
