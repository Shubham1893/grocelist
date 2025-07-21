// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, "Name is required"],
//   },
//   email: {
//     type: String,
//     required: [true, "Email is required"],
//     unique: true,
//     lowercase: true,
//   },
//   password: {
//     type: String,
//     required: [true, "Password is required"],
//   },
//   // Each user must belong to a family
//   familyId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Family', // Links to the Family model
//     required: true,
//   },
// });

// export default mongoose.model("User", userSchema);




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
  // --- ADDED FIELD ---
  mobileNumber: {
    type: String,
    required: [true, "Mobile number is required"],
    trim: true,
  },
  // --------------------
  familyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family',
    required: true,
  },
});

export default mongoose.model("User", userSchema);