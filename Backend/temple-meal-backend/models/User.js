const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: { // username for login
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['SuperAdmin', 'Admin', 'User'],
    default: 'User',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
