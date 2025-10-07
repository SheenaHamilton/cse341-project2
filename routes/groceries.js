const router = require('express').Router();

const recipesController = require('../controllers/groceries');
const validate = require('../utilities/groceryValidation');
const { isAuthenticated } = require("../middleware/authenticate");

router.get('/:id', recipesController.getGrocery);

router.get('/', recipesController.getAllGroceries);

router.post('/', isAuthenticated, validate.checkGrocery(), validate.checkGroceryData, recipesController.createGrocery);

router.put('/:id', isAuthenticated, validate.checkGrocery(), validate.checkGroceryData, recipesController.updateGrocery);

router.delete('/:id', isAuthenticated, recipesController.deleteGrocery);

module.exports = router;