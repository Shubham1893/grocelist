import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  // Link to the family that owns this item
  familyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family',
    required: true,
  },
  // Link to the user who added the item
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, "Item name is required"],
    trim: true,
  },
  quantity: {
    type: Number,
    required: [true, "Item quantity is required"],
    default: 1,
  },
  price: {
    type: Number,
    default: 0,
  },
  notes: {
    type: String,
    trim: true,
    default: '',
  }
}, {
  timestamps: true,
});

export default mongoose.model("GroceryItem", itemSchema);