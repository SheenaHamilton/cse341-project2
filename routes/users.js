const router = require('express').Router();

const userController = require('../controllers/users');
const { isAuthenticated } = require("../middleware/authenticate");

router.get('/', isAuthenticated, userController.getProfile);

module.exports = router;