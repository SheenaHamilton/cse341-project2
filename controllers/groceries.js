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
        res.status(500).json({ message: `We encountered an error while fetching all groceries` });
    }
};

const getGrocery = async (req, res) => {
    //#swagger.tags=['Groceries']
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: `Not valid grocery ID` });
        }

        const groceryId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection('groceries').findOne({ _id: groceryId });

        if (!result) {
            return res.status(404).json({ message: `No grocery found with that ID` });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);

    } catch (err) {
        console.error('Error getSingle:', err);
        res.status(500).json({ message: `Encountered an error while fetching grocery` });
    }
};

const updateGrocery = async (req, res) => {
    //#swagger.tags=['Groceries']
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: `Not valid grocery ID` });
        }

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
            return res.status(204).send();
        } else if (response.matchedCount > 0) {
            return res.status(200).json({ message: 'No changes needed, grocery is the same.' });
        } else {
            res.status(404).json(response.error || 'No update. Grocery not found');
        }
    } catch (err) {
        console.error('Error updateGroceries:', err);
        res.status(500).json({ message: `Encountered an error while updating the grocery ${req.params.id}` });
    }
};

const createGrocery = async (req, res) => {
    //#swagger.tags=['Groceries']
    try {
        const grocery = {
            name: req.body.name,
            category: req.body.category,
            quantity: req.body.quantity,
            unit: req.body.unit,
            purchased: req.body.purchased
        };

        const response = await mongodb.getDatabase().db().collection('groceries').insertOne(grocery);
        if (response.acknowledged) {
            res.status(201).send({ id: response.insertedId });
        } else {
            res.status(500).json(response.error || 'Error occured while recording the grocery');
        }
    } catch (err) {
        console.error('Error createGroceries:', err);
        res.status(500).json({ message: `Encountered an error while creating the grocery` });
    }

};

const deleteGrocery = async (req, res) => {
    //#swagger.tags=['Groceries']
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: `Not valid grocery ID` });
        }

        const groceryId = new ObjectId(req.params.id);

        const response = await mongodb.getDatabase().db().collection('groceries').deleteOne({ _id: groceryId });
        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json(response.error || 'Grocery not found');
        }
    } catch (err) {
        console.error('Error deleteGroceries:', err);
        res.status(500).json({ message: `Encountered an error while deleting the grocery ${req.params.id}` });
    }
};

module.exports = { getAllGroceries, getGrocery, updateGrocery, createGrocery, deleteGrocery }