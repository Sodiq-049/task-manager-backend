const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['success', 'comment', 'warning'],
      default: 'success',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Optional: if you're attaching notifications to a user
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
