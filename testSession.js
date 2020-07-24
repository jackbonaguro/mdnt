#!/usr/bin/env node

var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');

const next = require('next');
const dev = process.env.NODE_DEV !== 'production' //true false
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler()

var app = express();

nextApp.prepare();

app.use(cookieParser());

let sessionStore = session({secret: "Shh, its a secret!"});
// app.use(sessionStore);

app.use((req, res, next) => {
   let cookie = req.cookies['connect.sid'].substr(2);
   mongoose.connection.collection('sessions').findOne({
      _id: cookie
   }, (err, session) => {
      if (err) {
         return res.status(500).end(err);
      }
      console.log(session);
   });
   return next();
});

// app.get('/', function(req, res){
//    if(req.session.email){
//       req.session.email++;
//       res.send("You visited this page " + req.session.email + " times");
//    } else {
//       req.session.email = 1;
//       res.send("Welcome to this page for the first time!");
//    }
// });

app.post('/account/logout', (req, res, next) => {
   console.log(`Logout session: ${req.session.id}`);
   req.session.destroy((err) => {
      if (err) {
         return res.status(500).end(err);
      }
      console.log(req.session);
      return res.status(200).json({});
   })
});

const noscript = (req, res) => {
   return `
   <script>
   let logout = () => {
      fetch('/api/account/logout', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
         },
         credentials: 'include'
      }).then(res => res.json()).then(console.log).catch(console.error);
   }
   </script>
   <div>
      Email: ${res.locals.email}
      <br>
      Session: ${JSON.stringify(req.session)}
      <br>
      <button onClick="logout()">Log Out</button>
   </div>`
};

app.get('*', (req, res) => {
   console.log(`Get session: ${req.session.id}`);
   console.log(req.session);
   if(req.session.email){
      req.session.email++;
      // res.send("You visited this page " + req.session.email + " times");
   } else {
      req.session.email = 1;
      // res.send("Welcome to this page for the first time!");
   }
   res.locals = {
      email: req.session.email
   };
   // return res.end(noscript(req, res)); // This works, logout successfully resets the session
   return handle(req, res); // This does not work, despite sessionId being the same for logout and get
});
app.listen(3001);