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
    required: true
  },
  phoneNumber: {
    type: Number,
    required: true
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
  }
});
module.exports = mongoose.model("User", userSchema);
