// // import GroceryItem from "../models/GroceryItem.js";
// // import User from "../models/User.js";
// // import mongoose from "mongoose";
// // import twilio from "twilio";

// // // --- START: Pre-flight check for Twilio credentials ---
// // const accountSid = process.env.TWILIO_ACCOUNT_SID;
// // const authToken = process.env.TWILIO_AUTH_TOKEN;

// // if (!accountSid || !authToken) {
// //     console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
// //     console.error("!!! TWILIO ERROR: Credentials not found.               !!!");
// //     console.error("!!! Please check your .env file in the 'backend' folder. !!!");
// //     console.error("!!! Make sure TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN are set. !!!");
// //     console.error("!!! After editing .env, you MUST restart the server.   !!!");
// //     console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
// // }
// // // --- END: Pre-flight check ---


// // // Initialize Twilio client
// // const twilioClient = twilio(accountSid, authToken);

// // export const addItem = async (req, res) => {
// //   const { name, quantity, price, notes } = req.body;
  
// //   try {
// //     if (!name || quantity === undefined) {
// //       return res.status(400).json({ message: "Name and quantity are required." });
// //     }

// //     const item = await GroceryItem.create({
// //       name,
// //       quantity,
// //       price: price || 0,
// //       notes: notes || '',
// //       familyId: req.familyId,
// //       addedBy: req.userId,
// //     });

// //     const newItem = await GroceryItem.findById(item._id).populate('addedBy', 'name');

// //     // --- START: SMS Notification Logic ---
// //     try {
// //         const sender = await User.findById(req.userId);
// //         const familyMembers = await User.find({ familyId: req.familyId });

// //         const messageBody = `${sender.name} added '${newItem.name}' to the family grocery list.`;

// //         // The .filter() line has been removed. Now it sends to everyone.
// //         const smsPromises = familyMembers.map(member => {
// //             return twilioClient.messages.create({
// //                 body: messageBody,
// //                 from: process.env.TWILIO_PHONE_NUMBER,
// //                 to: member.mobileNumber
// //             });
// //         });

// //         await Promise.all(smsPromises);
// //         console.log("SMS notifications sent successfully to all members.");

// //     } catch (smsError) {
// //         console.error("Failed to send SMS notifications:", smsError);
// //     }
// //     // --- END: SMS Notification Logic ---

// //     res.status(201).json(newItem);
// //   } catch (error) {
// //     // Added a more specific error log here as well
// //     console.error("Error in addItem function:", error);
// //     res.status(500).json({ message: "Failed to add item.", error: error.message });
// //   }
// // };

// // // --- No changes to the functions below ---

// // export const getItems = async (req, res) => {
// //   try {
// //     const items = await GroceryItem.find({ familyId: req.familyId })
// //                                   .populate('addedBy', 'name')
// //                                   .sort({ createdAt: -1 });
// //     res.status(200).json(items);
// //   } catch (error) {
// //     res.status(500).json({ message: "Failed to load items.", error: error.message });
// //   }
// // };

// // export const deleteItem = async (req, res) => {
// //   const { id } = req.params;

// //   try {
// //     if (!mongoose.Types.ObjectId.isValid(id)) {
// //       return res.status(400).json({ message: "Invalid item ID." });
// //     }

// //     const deletedItem = await GroceryItem.findOneAndDelete({ _id: id, familyId: req.familyId });

// //     if (!deletedItem) {
// //       return res.status(404).json({ message: "Item not found in your family's list." });
// //     }

// //     res.status(200).json({ message: "Item deleted successfully." });
// //   } catch (error) {
// //     res.status(500).json({ message: "Failed to delete item.", error: error.message });
// //   }
// // };

// // export const updateItem = async (req, res) => {
// //   const { id } = req.params;
// //   const { name, quantity, price, notes } = req.body;

// //   try {
// //     if (!mongoose.Types.ObjectId.isValid(id)) {
// //       return res.status(400).json({ message: "Invalid item ID." });
// //     }

// //     const itemToUpdate = await GroceryItem.findById(id);

// //     if (!itemToUpdate) {
// //       return res.status(404).json({ message: "Item not found." });
// //     }

// //     if (itemToUpdate.familyId.toString() !== req.familyId) {
// //         return res.status(403).json({ message: "You are not authorized to edit this item." });
// //     }

// //     itemToUpdate.name = name;
// //     itemToUpdate.quantity = quantity;
// //     itemToUpdate.price = price;
// //     itemToUpdate.notes = notes;

// //     const updatedItem = await itemToUpdate.save();
// //     const populatedItem = await GroceryItem.findById(updatedItem._id).populate('addedBy', 'name');

// //     res.status(200).json(populatedItem);
// //   } catch (error) {
// //     res.status(500).json({ message: "Failed to update item.", error: error.message });
// //   }
// // };



// import GroceryItem from "../models/GroceryItem.js";
// import User from "../models/User.js";
// import mongoose from "mongoose";
// import twilio from "twilio";

// export const addItem = async (req, res) => {
//   const { name, quantity, price, notes } = req.body;
  
//   try {
//     if (!name || quantity === undefined) {
//       return res.status(400).json({ message: "Name and quantity are required." });
//     }

//     const item = await GroceryItem.create({
//       name,
//       quantity,
//       price: price || 0,
//       notes: notes || '',
//       familyId: req.familyId,
//       addedBy: req.userId,
//     });

//     const newItem = await GroceryItem.findById(item._id).populate('addedBy', 'name');

//     // --- START: SMS Notification Logic ---
//     try {
//         // Moved credential loading and client initialization inside the function
//         // This ensures process.env is loaded before we use the variables.
//         const accountSid = process.env.TWILIO_ACCOUNT_SID;
//         const authToken = process.env.TWILIO_AUTH_TOKEN;
//         const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

//         if (accountSid && authToken && twilioPhoneNumber) {
//             const twilioClient = twilio(accountSid, authToken); // Initialize client here
            
//             const sender = await User.findById(req.userId);
//             const familyMembers = await User.find({ familyId: req.familyId });

//             const messageBody = `${sender.name} added '${newItem.name}' to the family grocery list.`;

//             const smsPromises = familyMembers.map(member => {
//                 return twilioClient.messages.create({
//                     body: messageBody,
//                     from: twilioPhoneNumber,
//                     to: member.mobileNumber
//                 });
//             });

//             await Promise.all(smsPromises);
//             console.log("✅ SMS notifications sent successfully to all members.");
//         } else {
//             console.log("⚠️ Twilio credentials not set. Skipping SMS notifications.");
//         }
//     } catch (smsError) {
//         console.error("❌ Failed to send SMS notifications:", smsError);
//     }
//     // --- END: SMS Notification Logic ---

//     res.status(201).json(newItem);
//   } catch (error) {
//     console.error("❌ Error in addItem function:", error);
//     res.status(500).json({ message: "Failed to add item.", error: error.message });
//   }
// };

// // --- No changes to the functions below ---

// export const getItems = async (req, res) => {
//   try {
//     const items = await GroceryItem.find({ familyId: req.familyId })
//                                   .populate('addedBy', 'name')
//                                   .sort({ createdAt: -1 });
//     res.status(200).json(items);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to load items.", error: error.message });
//   }
// };

// export const deleteItem = async (req, res) => {
//   const { id } = req.params;

//   try {
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "Invalid item ID." });
//     }

//     const deletedItem = await GroceryItem.findOneAndDelete({ _id: id, familyId: req.familyId });

//     if (!deletedItem) {
//       return res.status(404).json({ message: "Item not found in your family's list." });
//     }

//     res.status(200).json({ message: "Item deleted successfully." });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to delete item.", error: error.message });
//   }
// };

// export const updateItem = async (req, res) => {
//   const { id } = req.params;
//   const { name, quantity, price, notes } = req.body;

//   try {
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "Invalid item ID." });
//     }

//     const itemToUpdate = await GroceryItem.findById(id);

//     if (!itemToUpdate) {
//       return res.status(404).json({ message: "Item not found." });
//     }

//     if (itemToUpdate.familyId.toString() !== req.familyId) {
//         return res.status(403).json({ message: "You are not authorized to edit this item." });
//     }

//     itemToUpdate.name = name;
//     itemToUpdate.quantity = quantity;
//     itemToUpdate.price = price;
//     itemToUpdate.notes = notes;

//     const updatedItem = await itemToUpdate.save();
//     const populatedItem = await GroceryItem.findById(updatedItem._id).populate('addedBy', 'name');

//     res.status(200).json(populatedItem);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to update item.", error: error.message });
//   }
// };




import GroceryItem from "../models/GroceryItem.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import twilio from "twilio";
import nodemailer from "nodemailer";

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
      familyId: req.familyId,
      addedBy: req.userId,
    });

    const newItem = await GroceryItem.findById(item._id).populate('addedBy', 'name');

    // --- Notification Logic ---
    // We will now try to send both SMS and Email notifications.
    const sender = await User.findById(req.userId);
    const familyMembers = await User.find({ familyId: req.familyId });
    const notificationTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // 1. --- Try to send SMS notifications ---
    try {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

        if (accountSid && authToken && twilioPhoneNumber) {
            const twilioClient = twilio(accountSid, authToken);
            const messageBody = `${sender.name} added '${newItem.name}' to the family grocery list.`;
            
            const smsPromises = familyMembers.map(member => {
                return twilioClient.messages.create({
                    body: messageBody,
                    from: twilioPhoneNumber,
                    to: member.mobileNumber
                });
            });
            await Promise.all(smsPromises);
            console.log("✅ SMS notifications sent successfully.");
        } else {
            console.log("⚠️ Twilio credentials not set. Skipping SMS.");
        }
    } catch (smsError) {
        console.error("❌ Failed to send SMS notifications:", smsError);
    }

    // 2. --- Try to send Email notifications ---
    try {
        const emailUser = process.env.EMAIL_USER;
        const emailPass = process.env.EMAIL_PASS;

        if (emailUser && emailPass) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: { user: emailUser, pass: emailPass },
            });

            const recipients = familyMembers.map(member => member.email).join(', ');
            const mailOptions = {
                from: `"FamilyGrocer" <${emailUser}>`,
                to: recipients,
                subject: `New Item Added: ${newItem.name}`,
                html: `
                    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                        <h2 style="color: #2c3e50;">Grocery List Update!</h2>
                        <p>Hi family,</p>
                        <p><b>${sender.name}</b> just added <b>${newItem.name}</b> to the grocery list.</p>
                        <p><b>Time:</b> ${notificationTime}</p>
                        <p>Have a great day!</p>
                        <p><em>- The FamilyGrocer App</em></p>
                    </div>
                `
            };
            await transporter.sendMail(mailOptions);
            console.log("✅ Email notifications sent successfully.");
        } else {
            console.log("⚠️ Email credentials not set. Skipping Email.");
        }
    } catch (emailError) {
        console.error("❌ Failed to send email notifications:", emailError);
    }
    // --- End of Notification Logic ---

    res.status(201).json(newItem);
  } catch (error) {
    console.error("❌ Error in addItem function:", error);
    res.status(500).json({ message: "Failed to add item.", error: error.message });
  }
};

// --- No changes to the functions below ---

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
    res.status(500).json({ message: "Failed to update item.", error: error.message });
  }
};
