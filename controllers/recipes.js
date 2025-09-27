const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAllRecipes = async (req, res) => {
    //#swagger.tags=['Recipes']
    try {
        const result = await mongodb.getDatabase().db().collection('recipes').find();
        result.toArray().then((recipes) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(recipes);
        });
    } catch (err) {
        console.error('Error getAllRecipes:', err);
        res.status(500).json({ message: `Encountered an error while fetching all Recipes` });
    }
};

const getRecipe = async (req, res) => {
    //#swagger.tags=['Recipes']
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: `Not valid recipe ID` });
        }
        const recipeId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection('recipes').findOne({ _id: recipeId });

        if (!result) {
            return res.status(404).json({ message: `No recipe found with that ID` });
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);

    } catch (err) {
        console.error('Error getSingle:', err);
        res.status(500).json({ message: `Encountered an error while fetching single recipe` });
    }
};

const updateRecipe = async (req, res) => {
    //#swagger.tags=['Recipes']
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: `Not valid recipe ID` });
        }

        const recipeId = new ObjectId(req.params.id);
        const recipe = {
            name: req.body.name,
            description: req.body.description,
            ingredients: req.body.ingredients,
            instructions: req.body.instructions,
            prepTime: req.body.prepTime,
            cookTime: req.body.cookTime,
            servings: req.body.servings,
            category: req.body.category,
            cuisine: req.body.cuisine
        };
        const response = await mongodb.getDatabase().db().collection('recipes').replaceOne({ _id: recipeId }, recipe);
        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else if (response.matchedCount > 0) {
            return res.status(200).json({ message: 'No changes needed, recipe is the same.' });
        } else {
            res.status(404).json(response.error || 'Error occured while updating the recipe');
        }
    } catch (err) {
        console.error('Error updateRecipe:', err);
        res.status(500).json({ message: `Encountered an error while updating the receipe ${req.params.id}` });
    }
}
const createRecipe = async (req, res) => {
    //#swagger.tags=['Recipes']
    try {
        const recipe = {
            name: req.body.name,
            description: req.body.description,
            ingredients: req.body.ingredients,
            instructions: req.body.instructions,
            prepTime: req.body.prepTime,
            cookTime: req.body.cookTime,
            servings: req.body.servings,
            category: req.body.category,
            cuisine: req.body.cuisine
        };

        const response = await mongodb.getDatabase().db().collection('recipes').insertOne(recipe);
        if (response.acknowledged) {
            res.status(201).send({ id: response.insertedId, ...recipe });
        } else {
            res.status(500).json(response.error || 'Error occured while recording the recipe');
        }
    } catch (err) {
        console.error('Error createRecipe:', err);
        res.status(500).json({ message: `Encountered an error while creating the recipe` });
    }
};

const deleteRecipe = async (req, res) => {
    //#swagger.tags=['Recipes']
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: `Not valid recipe ID` });
        }
        const recipeId = new ObjectId(req.params.id);

        const response = await mongodb.getDatabase().db().collection('recipes').deleteOne({ _id: recipeId });
        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json(response.error || 'Error occured while deleting the recipe');

        }
    } catch (err) {
        console.error('Error deleteRecipe:', err);
        res.status(500).json({ message: `Encountered an error while deleting the recipe` });
    }
};

module.exports = { getAllRecipes, getRecipe, updateRecipe, createRecipe, deleteRecipe }