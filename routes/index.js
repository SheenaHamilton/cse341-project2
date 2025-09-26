const router = require('express').Router();

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
    //#swagger.tags=['Recipe Project']
    res.send('Project 2: Recipe Project');
});

router.use('/recipes', require('./recipes'));

router.use('/groceries', require('./groceries'));

module.exports = router;