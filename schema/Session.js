const mongoose = require('mongoose');

const Session = new mongoose.Schema({
  account: mongoose.Schema.Types.ObjectId
}, { minimize: false });

Session.index({ account: 1 });

Session.statics.create = (callback) => {
  let session = new SessionModel({});
  session.save((err, newSession) => {
    if (err) {
      return callback(err);
    }
    if (!newSession) {
      return callback(new Error('Failed to save session'));
    }
    return callback(null, newSession);
  });
};

const SessionModel = mongoose.model('Session', Session);
module.exports = SessionModel;