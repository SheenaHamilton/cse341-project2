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
        console.error('Error getAll:', err);
        res.status(500).json({ message: `Encountered an error while fetching all Recipes` });
    }
};

const getRecipe = async (req, res) => {
    //#swagger.tags=['Recipes']
    try {
        const recipeId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection('recipes').find({ _id: recipeId });
        result.toArray().then((recipes) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(recipes[0]);
        });
    } catch (err) {
        console.error('Error getSingle:', err);
        res.status(500).json({ message: `Encountered an error while fetching single recipe` });
    }
};

const updateRecipe = async (req, res) => {
    //#swagger.tags=['Recipes']
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
    } else {
        res.status(500).json(response.error || 'Error occured while updating the recipe');

    }
};

const createRecipe = async (req, res) => {
    //#swagger.tags=['Recipes']
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
};

const deleteRecipe = async (req, res) => {
    //#swagger.tags=['Recipes']
    const recipeId = new ObjectId(req.params.id);

    const response = await mongodb.getDatabase().db().collection('recipes').deleteOne({ _id: recipeId });
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Error occured while deleting the recipe');

    }
};

module.exports = { getAllRecipes, getRecipe, updateRecipe, createRecipe, deleteRecipe }