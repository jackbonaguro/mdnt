var express = require('express');
var router = express.Router();

// Account API Router; for now the only API (no public routes)
const accountRouter = require('./account');
router.use('/account', accountRouter);

module.exports = router;
