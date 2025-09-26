const router = require('express').Router();

const recipesController = require('../controllers/groceries');
const validate = require('../utilities/groceryValidation');

router.get('/:id', recipesController.getGroceries);

router.get('/', recipesController.getAllGroceries);

router.post('/', validate.checkGrocery(), validate.checkGroceryData, recipesController.createGroceries);

router.put('/:id', validate.checkGrocery(), validate.checkGroceryData, recipesController.updateGroceries);

router.delete('/:id', recipesController.deleteGroceries);

module.exports = router;