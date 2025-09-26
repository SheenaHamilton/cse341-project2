const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAllGroceries = async (req, res) => {
    //#swagger.tags=['Groceries']
    try {
        const result = await mongodb.getDatabase().db().collection('groceries').find();
        result.toArray().then((groceries) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(groceries);
        });
    } catch (err) {
        console.error('Error getAll:', err);
        res.status(500).json({ message: `Encountered an error while fetching all groceries` });
    }
};

const getGroceries = async (req, res) => {
    //#swagger.tags=['Groceries']
    try {
        const groceryId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection('groceries').find({ _id: groceryId });
        result.toArray().then((groceries) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(groceries[0]);
        });
    } catch (err) {
        console.error('Error getSingle:', err);
        res.status(500).json({ message: `Encountered an error while fetching single grocery` });
    }
};

const updateGroceries = async (req, res) => {
    //#swagger.tags=['Groceries']
    const groceryId = new ObjectId(req.params.id);
    const grocery = {
        name: req.body.name,
        category: req.body.category,
        quantity: req.body.quantity,
        unit: req.body.unit,
        purchased: req.body.purchased
    };
    const response = await mongodb.getDatabase().db().collection('groceries').replaceOne({ _id: groceryId }, grocery);
    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Error occured while updating the grocery');

    }
};

const createGroceries = async (req, res) => {
    //#swagger.tags=['Groceries']
    const grocery = {
        name: req.body.name,
        category: req.body.category,
        quantity: req.body.quantity,
        unit: req.body.unit,
        purchased: req.body.purchased
    };

    const response = await mongodb.getDatabase().db().collection('groceries').insertOne(grocery);
    if (response.acknowledged) {
        res.status(201).send({ id: response.insertedId, ...grocery });
    } else {
        res.status(500).json(response.error || 'Error occured while recording the grocery');
    }
};

const deleteGroceries = async (req, res) => {
    //#swagger.tags=['Groceries']
    const groceryId = new ObjectId(req.params.id);

    const response = await mongodb.getDatabase().db().collection('groceries').deleteOne({ _id: groceryId });
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Error occured while deleting the grocery');

    }
};

module.exports = { getAllGroceries, getGroceries, updateGroceries, createGroceries, deleteGroceries }