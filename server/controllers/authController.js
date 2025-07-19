import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Family from "../models/Family.js";
import { customAlphabet } from "nanoid";

// Helper function to generate a unique family code
const generateUniqueFamilyCode = async () => {
  const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6);
  let familyCode;
  let isUnique = false;
  while (!isUnique) {
    familyCode = nanoid();
    const existingFamily = await Family.findOne({ familyCode });
    if (!existingFamily) {
      isUnique = true;
    }
  }
  return familyCode;
};

// Controller for a user creating a NEW family
export const registerNewFamily = async (req, res) => {
  const { name, email, password, familyName } = req.body;

  try {
    if (!name || !email || !password || !familyName) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "User with this email already exists." });
    }

    const familyCode = await generateUniqueFamilyCode();
    const newFamily = await Family.create({ familyName, familyCode });

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({ name, email, password: hashedPassword, familyId: newFamily._id });

    const token = jwt.sign({ id: newUser._id, familyId: newFamily._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // FIX: Standardized response to match the login response structure.
    res.status(201).json({
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
      family: { id: newFamily._id, name: newFamily.familyName, code: newFamily.familyCode },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during new family registration.", error: error.message });
  }
};

// Controller for a user JOINING an existing family
export const registerJoinFamily = async (req, res) => {
  const { name, email, password, familyCode } = req.body;

  try {
    if (!name || !email || !password || !familyCode) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const family = await Family.findOne({ familyCode: familyCode.toUpperCase() });
    if (!family) {
      return res.status(404).json({ message: "Invalid family code. Please check and try again." });
    }

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "User with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({ name, email, password: hashedPassword, familyId: family._id });
    
    const token = jwt.sign({ id: newUser._id, familyId: family._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // FIX: Standardized response to include full user/family info and token.
    res.status(201).json({
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
      family: { id: family._id, name: family.familyName, code: family.familyCode },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during family joining.", error: error.message });
  }
};

// Standard login controller
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password." });
    }

    const user = await User.findOne({ email }).populate('familyId', 'familyName familyCode');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign({ id: user._id, familyId: user.familyId._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({
      user: { id: user._id, name: user.name, email: user.email },
      family: { id: user.familyId._id, name: user.familyId.familyName, code: user.familyId.familyCode },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during login.", error: error.message });
  }
};