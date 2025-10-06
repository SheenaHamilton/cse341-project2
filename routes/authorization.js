const express = require('express');
const router = express.Router();
const passport = require('../config/passport');

router.get('/login', passport.authenticate('github'), (req, res) => { scope: ['user:email'] });

router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});


router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/', session: false }),
    (req, res) => {
        req.session.user = req.user;
        res.redirect('/');
    });

module.exports = router;