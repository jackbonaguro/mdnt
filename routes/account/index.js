var express = require('express');
var router = express.Router();

const Session = require('../../schema/Session');

const receiveSettingRouter = require('./receiveSetting');
router.use('/receiveSetting', receiveSettingRouter);

const Account = require('../../schema/Account');

router.post('/login', (req, res) => {
  // Register the account id on the session
  console.log('Login Params:');
  console.log(req.body);
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
  // req.session.email = req.session.email ? req.session.email + 1 : 1;
  // return res.json({});
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

router.post('/changepassword', (req, res, next) => {
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

router.post('/changeusername', (req, res, next) => {
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

router.post('/changeemail', (req, res, next) => {
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

// router.post('/:username', (req, res, next) => {
//   return res.json({
//     username: req.params.username
//   });
// });

module.exports = router;
