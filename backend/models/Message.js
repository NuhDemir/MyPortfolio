const mongoose = require('mongoose');

const messsageSchema= new mongoose.Schema({

 name: {
    type: String,
    required: [true, 'Name is required.'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long.'],
    maxlength: [100, 'Name cannot be more than 100 characters long.']
  },

  email: {
    type: String,
    required: [true, 'Email is required.'],
    trim: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email address.']
  },

  message: {
    type: String,
    required:[true, 'Message is required.'],
    trim: true,
    minlength: [10, 'Message must be at least 10 characters long.'],
    maxlength: [1000, 'Message cannot be more than 500 characters long.']
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  }

});

const Message = mongoose.model('Message',MesssageSchema);

module.exports = Message;