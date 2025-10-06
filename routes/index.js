const router = require('express').Router();
const passport = require('passport');

router.use('/', require('./swagger'));
router.use('/recipes', require('./recipes'));
router.use('/groceries', require('./groceries'));
router.use('/profile', require('./users'));

module.exports = router;