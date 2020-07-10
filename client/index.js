const next = require('next');
const dev = process.env.NODE_DEV !== 'production' //true false
const nextApp = next({
    dev,
    dir: './client'
});

module.exports = nextApp;