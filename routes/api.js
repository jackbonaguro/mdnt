var express = require('express');
var router = express.Router();

// Account API Router; for now the only API (no public routes)
const accountRouter = require('./account');
const userRouter = require('./user');
router.use('/account', accountRouter);
router.use('/u', userRouter);

module.exports = router;
