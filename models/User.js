const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contact: { type: String, required: true },
  bankName: { type: String, required: true },
  aadhar: { type: String, required: true }, 
  pan: { type: String, required: true },    
  fingerprint: { type: String, required: true } 
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);