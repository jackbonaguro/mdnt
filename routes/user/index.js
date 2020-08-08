const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const Account = require('../../schema/Account');

router.post('/:username', (req, res, next) => {
  let {
    username
  } = req.params;
  Account.findOne({
    username
  }, (err, account) => {
    if (err) {
      return res.status(400).json(err).end();
    }
    if (!account) {
      return res.status(400).json(new Error('Account not found')).end();
    }
    let data = account.getPublicAccount();
    return res.json(data);
  });
});

module.exports = router;
