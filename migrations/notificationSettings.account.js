const mongoose = require('mongoose');
const Account = require('../schema/Account');

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
    console.log('Begin');
    let accountStream = Account.find({}).cursor();
    accountStream.on('data', (account) => {
        console.log(account._id);
        if (account.notificationSettings &&
            account.notificationSettings.email &&
            !account.notificationSettings.webHook &&
            !account.notificationSettings.push) {
            console.log('Updating');
            Account.findOneAndUpdate({
                _id: account._id
            }, {
                $set: {
                    notificationSettings: {
                        email: true,
                        webHook: false,
                        push: false
                    }
                }
            }, (err, result) => {
                if (err) {
                    console.error(err);
                }
                console.log(result);
            })
        }
    });
    accountStream.on('error', (err) => {
        console.error(err);
    });
    accountStream.on('end', () => {
        setTimeout(() => {
            db.close();
        }, 1000);
    });
});