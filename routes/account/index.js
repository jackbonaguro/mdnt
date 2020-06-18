var express = require('express');
var router = express.Router();

const receiveSettingRouter = require('./receiveSetting');
router.use('/receiveSetting', receiveSettingRouter);

const Account = require('../../schema/Account');

router.post('/:username', (req, res, next) => {
  return res.json({
    username: req.params.username
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

module.exports = router;
