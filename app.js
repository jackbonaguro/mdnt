var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const next = require('next');
const dev = process.env.NODE_DEV !== 'production' //true false
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler()
var session = require('express-session')
var MongoDBStore = require('connect-mongodb-session')(session)

const Account = require('./schema/Account');
const Block = require('./schema/Block');
const Session = require('./schema/Session');

const app = express();

var store = new MongoDBStore({
  uri: 'mongodb://127.0.0.1/midnightcash',
  collection: 'sessions'
});
store.on('error', (err) => {
  console.error(err);
});

const accountRouter = require('./routes/account');

mongoose.connect('mongodb://127.0.0.1/midnightcash', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let blockStream;

db.once('open', () => {
  nextApp.prepare().then(() => {
    initializeBlockStream();
  });
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

const createSession = (req, res, next) => {
  return Session.create((err, session) => {
    if (err) {
      return res.status(500).end(err);
    }
    req.session = session;
    res.cookie('connect.sid', 's:' + session._id.toHexString());
    return next();
  });
};

app.use((req, res, next) => {
  try {
    let cookie = req.cookies['connect.sid'];
    if (!cookie) {
      // Create a new session
      return createSession(req, res, next);
    }
    let sessionID = mongoose.Types.ObjectId.createFromHexString(cookie.substr(2));
    
    Session.findOne({
        _id: sessionID
    }, (err, session) => {
        if (err) {
          return res.status(500).end(err);
        }
        if (!session) {
          return createSession(req, res, next);
        }
        req.session = session;
        return next();
    });
  } catch (err) {
    console.error(err);
    return res.status(500).end(err);
  }
});

app.use('/account', accountRouter);

app.get('*', (req, res) => {
  if (req.session.account) {
    return Account.findOne({
      _id: req.session.account
    }, (err, account) => {
      res.locals.email = account.email;
      return handle(req, res);
    });
  }
  return handle(req, res);
});

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