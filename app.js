var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

const Account = require('./schema/Account');
const Block = require('./schema/Block');

var app = express();

const accountRouter = require('./routes/account');

mongoose.connect('mongodb://127.0.0.1/midnightcash', { useNewUrlParser: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let blockStream;

db.once('open', () => {
  initializeBlockStream();
});

const initializeBlockStream = () => {
  blockStream = Block.watch(null, {
    fullDocument: 'updateLookup'
  }).on('change', (change) => {
    handleBlockChange(change);
  }).on('error', (err) => {
    console.error(err);
  }).on('close', (err) => {
    initializeBlockStream();
  });
  console.log('Block Stream Initialized');
};

const handleBlockChange = (change) => {
  if (change.operationType === 'insert') {
    // Process new block
    let blockHash = change.fullDocument.hash;
    let blockHeight = change.fullDocument.height;
    let receivingAddresses = change.fullDocument.receivingAddresses;
    let transactions = change.fullDocument.transactions;

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
      }).address
      let receivingTxid = Object.keys(change.fullDocument.transactions).find((txid) => {
        return transactions[txid].receivingAddresses.includes(receivingAddress);
      });
      account.sendReceiveEmail(blockHash, receivingAddress, receivingTxid, (err) => {
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

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/account', accountRouter);

app.use(function(req, res, next) {
  return res.status(404).end();
});

// error handler
// app.use(function(err, req, res, next) {
//   res.locals.message = err.message;
//   res.locals.error = err; // req.app.get('env') === 'development' ? err : {};

//   console.error(err);
//   res.status(err.status || 500).json(err);
// });

module.exports = app;
