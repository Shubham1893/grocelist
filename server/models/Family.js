import mongoose from "mongoose";

const familySchema = new mongoose.Schema({
  familyName: {
    type: String,
    required: [true, "Family name is required"],
    trim: true,
  },
  familyCode: {
    type: String,
    required: true,
    unique: true, // Ensures no two families can have the same code
    trim: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model("Family", familySchema);