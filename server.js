const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongodb = require('./data/database');
const passport = require('./config/passport');
const session = require('express-session');
const cors = require('cors');

const port = process.env.PORT || 3000;
const authRoutes = require('./routes/authorization');

app
    .use(bodyParser.json())
    .use(session({
        secret: "secret",
        resave: false,
        saveUninitialized: true,
    }))
    .use(passport.initialize())
    .use(passport.session())
    .use(cors({
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Z-Key'],
        origin: '*'
    }))
    .use('/', require('./routes/authorization'))
    .use('/', require('./routes'));

app.get('/', (req, res) => { res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.username}` : "Logged Out") });


//Catch all Error 
process.on('uncaughtException', (err, origin) => {
    console.log(process.stderr.fd, `Exception occurred: ${err}\n` + `Exception occurred at ${origin}`);
});

mongodb.initDB((err) => {
    if (err) {
        console.log(err);
    }
    else {
        app.listen(port, () => { console.log(`Running on port ${port}`) });
    }
})
