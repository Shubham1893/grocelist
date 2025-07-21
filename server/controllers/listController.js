import GroceryItem from "../models/GroceryItem.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

const sendNotificationEmail = async (newItem, sender) => {
  try {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (emailUser && emailPass) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: emailUser, pass: emailPass },
      });

      // This query will now work because sender.familyId will be defined.
      const familyMembers = await User.find({ familyId: sender.familyId });
      
      const notificationTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
      const recipients = familyMembers.map(member => member.email).join(', ');

      if (recipients) {
        const mailOptions = {
          from: `"FamilyGrocer" <${emailUser}>`,
          to: recipients,
          subject: `New Item Added: ${newItem.name}`,
          html: `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;"><h2 style="color: #2c3e50;">Grocery List Update!</h2><p>Hi family,</p><p><b>${sender.name}</b> just added <b>${newItem.name}</b> to the grocery list.</p><p><b>Time:</b> ${notificationTime}</p><p>Have a great day!</p><p><em>- The FamilyGrocer App</em></p></div>`
        };
        await transporter.sendMail(mailOptions);
        console.log("✅ Email notifications sent successfully.");
      } else {
        console.log("⚠️ No recipients found for this family. Skipping email.");
      }
    } else {
      console.log("⚠️ Email credentials not set. Skipping Email.");
    }
  } catch (emailError) {
    console.error("❌ Failed to send email notifications:", emailError);
  }
};

export const addItem = async (req, res) => {
  const { name, quantity, price, notes } = req.body;
  try {
    if (!name || quantity === undefined) {
      return res.status(400).json({ message: "Name and quantity are required." });
    }
    const item = await GroceryItem.create({ name, quantity, price: price || 0, notes: notes || '', familyId: req.familyId, addedBy: req.userId });
    
    // --- THIS IS THE FIX ---
    // The .populate() method now includes 'familyId' along with 'name'.
    // This ensures the sender object has the familyId needed for the email function.
    const newItem = await GroceryItem.findById(item._id).populate('addedBy', 'name familyId');
    // --------------------

    res.status(201).json(newItem);
    sendNotificationEmail(newItem, newItem.addedBy);
  } catch (error) {
    console.error("❌ Error in addItem function:", error);
    res.status(500).json({ message: "Failed to add item.", error: error.message });
  }
};

export const getItems = async (req, res) => {
  try {
    const items = await GroceryItem.find({ familyId: req.familyId }).populate('addedBy', 'name').sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to load items." });
  }
};

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
    res.status(500).json({ message: "Failed to delete item." });
  }
};

export const updateItem = async (req, res) => {
  const { id } = req.params;
  const { name, quantity, price, notes } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid item ID." });
    }
    const itemToUpdate = await GroceryItem.findById(id);
    if (!itemToUpdate) {
      return res.status(404).json({ message: "Item not found." });
    }
    if (itemToUpdate.familyId.toString() !== req.familyId) {
        return res.status(403).json({ message: "You are not authorized to edit this item." });
    }
    itemToUpdate.name = name;
    itemToUpdate.quantity = quantity;
    itemToUpdate.price = price;
    itemToUpdate.notes = notes;
    const updatedItem = await itemToUpdate.save();
    const populatedItem = await GroceryItem.findById(updatedItem._id).populate('addedBy', 'name');
    res.status(200).json(populatedItem);
  } catch (error) {
    res.status(500).json({ message: "Failed to update item." });
  }
};
