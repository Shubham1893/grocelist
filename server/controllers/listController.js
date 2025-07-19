import GroceryItem from "../models/GroceryItem.js";
import mongoose from "mongoose";

// Add a new grocery item to the family list
export const addItem = async (req, res) => {
  const { name, quantity, price, notes } = req.body;
  
  try {
    if (!name || quantity === undefined) {
      return res.status(400).json({ message: "Name and quantity are required." });
    }

    const item = await GroceryItem.create({
      name,
      quantity,
      price: price || 0,
      notes: notes || '',
      familyId: req.familyId, // Use familyId from token
      addedBy: req.userId,   // Use userId from token
    });

    const newItem = await GroceryItem.findById(item._id).populate('addedBy', 'name');

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: "Failed to add item.", error: error.message });
  }
};

// Get all grocery items for the user's family
export const getItems = async (req, res) => {
  try {
    const items = await GroceryItem.find({ familyId: req.familyId })
                                   .populate('addedBy', 'name')
                                   .sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to load items.", error: error.message });
  }
};

// Delete a grocery item from the family list
export const deleteItem = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid item ID." });
    }

    const deletedItem = await GroceryItem.findOneAndDelete({ _id: id, familyId: req.familyId });

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found in your family's list." });
    }

    res.status(200).json({ message: "Item deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete item.", error: error.message });
  }
};