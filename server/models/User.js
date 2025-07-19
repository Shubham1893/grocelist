import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  // Each user must belong to a family
  familyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family', // Links to the Family model
    required: true,
  },
});

export default mongoose.model("User", userSchema);