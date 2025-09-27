const router = require('express').Router();

const recipesController = require('../controllers/groceries');
const validate = require('../utilities/groceryValidation');

router.get('/:id', recipesController.getGrocery);

router.get('/', recipesController.getAllGroceries);

router.post('/', validate.checkGrocery(), validate.checkGroceryData, recipesController.createGrocery);

router.put('/:id', validate.checkGrocery(), validate.checkGroceryData, recipesController.updateGrocery);

router.delete('/:id', recipesController.deleteGrocery);

module.exports = router;