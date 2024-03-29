const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
  },
  phoneNumber: {
    type: Number,
  },
  residentialAddress: {
    type: String,
  },
  country: {
    type: String,
  },
  city: {
    type: String,
  },
  instituteName: {
    type: String,
  },
  instituteAddress: {
    type: String,
  },
  instituteAreaPinCode: {
    type: String,
  },
  yearOfStudy: {
    type: Number,
  },
  token: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  image: {
    type : String,
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String
  },
  userType: {
    type: String,
    default: "User"
  },
  teams : [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: []
    },
  ],
});
module.exports = mongoose.model("User", userSchema);
