const { body, validationResult } = require('express-validator');

const validate = {};


// Validate Recipe data  
validate.checkRecipe = () => {
    return [
        // recipe name is required and must be string
        body('name')
            .trim()
            .notEmpty()
            .escape()
            .withMessage('The recipe name is required.'),

        // description is optional 
        body('description')
            .optional()
            .trim()
            .escape(),

        // valid ingredients is required as an array
        body('ingredients')
            .isArray({ min: 1 })
            .withMessage('Ingredients must be an array with at least one item.'),

        //ingredients must all have a name, amount, and unit
        body('ingredients.*.name')
            .trim()
            .notEmpty()
            .withMessage('Ingredient name is required.'),

        body('ingredients.*.amount')
            .trim()
            .notEmpty()
            .withMessage('Ingredient amount is required.'),

        body('ingredients.*.unit')
            .trim()
            .notEmpty()
            .withMessage('Ingredient unit is required.'),

        // instructions is optional as an array
        body('instructions')
            .isArray({ min: 0 }),

        body('prepTime')
            .optional()
            .isNumeric()
            .withMessage('Perparation time must be a number in minutes.'),

        body('cookTime')
            .isNumeric()
            .withMessage('Cooktime is required and time must be a number in minutes.'),

        body('servings')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Serving must be numeric and must be at least 1 serving.'),

        body('category')
            .optional()
            .trim()
            .escape(),

        body('cuisine')
            .optional()
            .trim()
            .escape()
    ]
};

// Check recipe data and return errors or continue to modify/add the recipe
validate.checkRecipeData = async (req, res, next) => {
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        console.error('Error checkRecipeData:', errors);
        res.status(500).json({ message: `Encountered an error validating: ` + errors.array()[0].msg });
        return
    }
    next()
};

module.exports = validate;
