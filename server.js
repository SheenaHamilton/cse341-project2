const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongodb = require('./data/database');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');

const port = process.env.PORT || 3000;

app
    .use(bodyParser.json())
    .use(session({
        secret: "secret",
        resave: false,
        saveUninitialized: true,
    }))
    .use(passport.initialize)
    .use(passport.session())
    .use((req, res, next) => {
        res.setHeader('Access-Control-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Z-Key');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        next();
    })
    .use(cors({ methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'] }))
    .use(cors({ origin: '*' }))
    .use('/', require('./routes'));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENTID,
    slientSecret: process.env.GITHUB_SECRET,
    callbackURL: process.env.CALLBACK_URL
},
    function (accessToken, refreshToekn, profile, done) {
        // User.findOrCreate({githubId: profile.id}, function(err,user) {
        return done(null, profile)
        // });
    }
))

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

app.get('/', (req, res) => { res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : "Logged Out") });

app.get('github/callback', passport.authenticate('github', { failureRedirect: '/api-docs', session: false }),
    (req, res) => {
        req.session.user = req.user;
        res.redirect('/');
    });

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
