var express = require('express');
var router = express.Router();

const Session = require('../../schema/Session');

const receiveSettingRouter = require('./receiveSetting');

const Account = require('../../schema/Account');

router.post('/login', (req, res) => {
  // Register the account id on the session
  return Account.findOne({
    email: req.body.email
  }, (err, account) => {
    if (err || !account) {
      return res.status(500).end(err || new Error('Account not found'));
    }
    if (account.password !== req.body.password) {
      return res.status(401).end(new Error('Incorrect password'));
    }

    req.session.account = account._id;
    return req.session.save((err) => {
      if (err) {
        return res.status(500).end(err);
      }
      return res.status(200).json({
        email: req.body.email
      });
    });
  });
});

router.post('/logout', (req, res, next) => {
  req.session.account = null;
  return req.session.save((err) => {
    if (err) {
      return res.status(500).end(err);
    }
    return res.status(200).json({});
  });
});

router.post('/create', (req, res, next) => {
  let {
    email,
    username,
    password
  } = req.body;
  if (!email || !username || !password) {
    return res.end('Missing parameter');
  }
  // TODO: Hash password
  
  new Account({
    email,
    username,
    password
  }).save((err, newAccount) => {
    if (err) {
      return res.status(400).json(err).end();
    }
    if (!newAccount) {
      return res.status(400).json(new Error('Failed to save account')).end();
    }
    return res.status(200).json(req.body).end();
  });
});

const authMiddleware = (req, res, next) => {
  let {
    email
  } = req.body;
  Account.findOne({
    _id: req.session.account
  }, (err, account) => {
    if (err) {
      return res.status(400).json(err).end();
    }
    if (!account) {
      return res.status(400).json(new Error('Account not found')).end();
    }
    if (account.email !== email) {
      return res.status(401).end(new Error('Unauthenticated request'));
    }
    req.account = account;
    return next();
  })
};

router.use('/receiveSetting', authMiddleware, receiveSettingRouter);

router.post('/changepassword', authMiddleware, (req, res, next) => {
  let {
    email,
    newPassword
  } = req.body;
  if (!email || !newPassword) {
    return res.end('Missing parameter');
  }
  // TODO: Validate session
  Account.findOneAndUpdate({
    email
  }, {
    password: newPassword
  }, {}, (err, newAccount) => {
    if (err) {
      return res.status(400).json(err).end();
    }
    if (!newAccount) {
      return res.status(400).json(new Error('Account not found')).end();
    }
    return res.status(200).json(req.body).end();
  });
});

router.post('/changeusername', authMiddleware, (req, res, next) => {
  let {
    email,
    newUsername
  } = req.body;
  if (!email || !newUsername) {
    return res.end('Missing parameter');
  }
  // TODO: Validate session
  Account.findOneAndUpdate({
    email
  }, {
    username: newUsername
  }, {}, (err, newAccount) => {
    if (err) {
      return res.status(400).json(err).end();
    }
    if (!newAccount) {
      return res.status(400).json(new Error('Account not found')).end();
    }
    return res.status(200).json(req.body).end();
  });
});

router.post('/changeemail', authMiddleware, (req, res, next) => {
  let {
    email,
    newEmail
  } = req.body;
  if (!email || !newEmail) {
    return res.end('Missing parameter');
  }
  // TODO: Validate session
  Account.findOneAndUpdate({
    email
  }, {
    email: newEmail
  }, {}, (err, newAccount) => {
    if (err) {
      return res.status(400).json(err).end();
    }
    if (!newAccount) {
      return res.status(400).json(new Error('Account not found')).end();
    }
    return res.status(200).json(req.body).end();
  });
});

router.post('/', authMiddleware, (req, res, next) => {
  let data = req.account.getAccount();
  return res.json(data);
});

module.exports = router;
