const { body, validationResult } = require('express-validator');

const validate = {};

// Validate Groceries data  
validate.checkGrocery = () => {
    return [
        // groceries name is required and must be string
        body('name')
            .trim()
            .notEmpty()
            .escape()
            .withMessage('The grocery name is required.'),

        // category is required 
        body('category')
            .trim()
            .notEmpty()
            .escape()
            .withMessage('The grocery category is required.'),

        //quantity is optional BUT if supplied must be a number
        body('quantity')
            .optional()
            .isNumeric()
            .withMessage('Quantity must be a number'),

        // unit is required 
        body('category')
            .optional()
            .trim()
            .escape(),

        // purchased must be a boolean. required.
        body('purchased')
            .optional()
            .isBoolean()
            .withMessage('Purchased must be a boolean value')
    ]
};

// Check groceries data and return errors or continue to modify/add the groceries
validate.checkGroceryData = async (req, res, next) => {
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        console.error('Error checkGroceryData:', errors);
        res.status(500).json({ message: `Encountered an error validating Grocery: ` + errors.array()[0].msg });
        return
    }
    next()
};

module.exports = validate;
