var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const next = require('next');
const dev = process.env.NODE_DEV !== 'production' //true false
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler()
const Account = require('./schema/Account');
const Block = require('./schema/Block');
const Session = require('./schema/Session');

const RPCRequestManager = require('./RPCRequestManager');
const ConfirmedBlockManager = require('./ConfirmedBlockManager');
const DonationManager = require('./DonationManager');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Set up background managers / daemons / connections
mongoose.connect('mongodb://127.0.0.1/midnightcash', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', () => {
  nextApp.prepare().then(() => {
    RPCRequestManager.start((err) => {
      if (err) {
        console.error(err);
      }
      ConfirmedBlockManager.start((err) => {
        if (err) {
          console.error(err);
        }
        DonationManager.start((err) => {
          if (err) {
            console.error(err);
          }
        });
      });
    });
  });
});

// Session Middleware - separate from auth middleware in account/js;
// this just makes sure all requests have a cookie
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

// Account API Router; for now the only API (no public routes)
const accountRouter = require('./routes/account');
app.use('/account', accountRouter);

// Everything else goes to Next frontend
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

module.exports = app;