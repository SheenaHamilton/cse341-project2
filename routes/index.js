const router = require('express').Router();
const passport = require('passport');

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
    //#swagger.tags=['Recipe Project']
    res.send('Project 2: Recipe Project');
});

router.use('/recipes', require('./recipes'));

router.use('/groceries', require('./groceries'));

router.get('/login', passport.authenticate('gitlab'), (req, res) => { });

router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

module.exports = router;