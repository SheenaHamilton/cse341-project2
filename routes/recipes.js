const router = require('express').Router();
const recipesController = require('../controllers/recipes');
const validate = require('../utilities/recipeValidation');
const {isAuthenticated} = require("../middleware/authenticate");

router.get('/:id', recipesController.getRecipe);

router.get('/', recipesController.getAllRecipes);

router.post('/', isAuthenticated, validate.checkRecipe(), validate.checkRecipeData, recipesController.createRecipe);

router.put('/:id', isAuthenticated, validate.checkRecipe(), validate.checkRecipeData, recipesController.updateRecipe);

router.delete('/:id', isAuthenticated, recipesController.deleteRecipe);

module.exports = router;