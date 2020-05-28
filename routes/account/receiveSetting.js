var express = require('express');
var router = express.Router();

const Account = require('../../schema/Account');

router.post('/add', (req, res, next) => {
  let {
    email,
    currency,
    address
  } = req.body;
  if (!email || !currency || !address) {
    return res.end('Missing parameter');
  }
  // TODO: Validate session
  Account.findOneAndUpdate({
    email,
    receiveSettings: {
      $not: {
        $elemMatch: {
          currency
        }
      }
    }
  }, {
    $push: {
      receiveSettings: {
        currency,
        address
      }
    }
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

router.post('/remove', (req, res, next) => {
  let {
    email,
    currency
  } = req.body;
  if (!email || !currency) {
    return res.end('Missing parameter');
  }
  // TODO: Validate session
  Account.findOneAndUpdate({
    email
  }, {
    $pull: {
      receiveSettings: {
        currency
      }
    }
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
