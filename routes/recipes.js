const router = require('express').Router();

const recipesController = require('../controllers/recipes');
const validate = require('../utilities/recipeValidation');

router.get('/:id', recipesController.getRecipe);

router.get('/', recipesController.getAllRecipes);

router.post('/', validate.checkRecipe(), validate.checkRecipeData, recipesController.createRecipe);

router.put('/:id', recipesController.updateRecipe);

router.put('/:id', validate.checkRecipe(), validate.checkRecipeData, recipesController.updateRecipe);

router.delete('/:id', recipesController.deleteRecipe);

module.exports = router;